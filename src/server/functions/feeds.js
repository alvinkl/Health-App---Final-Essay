import moment from 'moment'
import { Types as mTypes } from 'mongoose'
import { uniq } from 'lodash'

import { sendPushNotification } from '@services/webpush'

import { googleMaps } from '@config/urls'
import { GoogleGeocodingAPIKey } from '@config/keys'
import { LIKE, UNLIKE, FEED_AVAILABLE, FEED_REMOVED } from '@constant'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

import Feeds from '@model/Feeds'
import User from '@model/User'

export const getGeneralFeeds = async (current_user = 0, page = 0) => {
    const offset = page * 10

    const queryFeeds = {
        status: FEED_AVAILABLE,
    }
    const [err, data] = await to(
        Feeds.find(queryFeeds)
            .skip(offset)
            .limit(5)
            .sort({ create_time: -1 })
    )
    if (err) return Promise.reject({ code: 500, message: err })

    const google_ids = uniq(
        data.reduce(
            (p, c) => [
                ...p,
                c.user_id,
                ...c.comments.map(d => d.user_id),
                ...c.likes.map(d => d.user_id),
            ],
            []
        )
    )

    const query = [
        { $match: { googleID: { $in: google_ids } } },
        {
            $project: {
                _id: '$googleID',
                username: '$name',
                avatar: '$profile_img',
            },
        },
    ]

    const [errUser, users] = await to(User.aggregate(query))
    if (errUser) return Promise.reject({ code: 500, message: err })

    const feeds_data = data.map(d => ({
        post_id: d._id,
        title: d.title,
        subtitle: d.subtitle,
        image: d.image,
        likes: d.likes.map(user_id => ({
            ...users.find(u => u._id === user_id),
        })),
        total_likes: d.likes.length,
        comments: d.comments.map(d => ({
            content: d.content,
            user: users.find(u => u._id === d.user_id),
            create_time: d.create_time,
        })),
        like_status: ~d.likes.indexOf(current_user) ? 1 : 0,
        own_feed: d.user_id === current_user,
        user: users.find(u => u._id === d.user_id),
        create_time: moment(d.create_time).fromNow(),
    }))

    return Promise.resolve(feeds_data)
}

export const getOneFeed = async (post_id, user_id, detail = false) => {
    let data = {}

    let query = { _id: mTypes.ObjectId(post_id) }
    if (user_id)
        query = {
            ...query,
            user_id,
        }

    const [err, feed] = await to(Feeds.findOne(query))
    if (err) return Promise.reject({ code: 500, message: err })

    if (!feed)
        return Promise.error({
            code: 400,
            message: `Feed with id=${post_id} not found!`,
        })

    data = feed

    if (detail) {
        const google_ids = uniq([
            feed.user_id,
            ...feed.comments.map(d => d.user_id),
            ...feed.likes.map(d => d.user_id),
        ])
        const query_user = [
            { $match: { googleID: { $in: google_ids } } },
            {
                $project: {
                    _id: '$googleID',
                    username: '$name',
                    avatar: '$profile_img',
                },
            },
        ]

        const [errUser, users] = await to(User.aggregate(query_user))
        if (errUser) return Promise.reject({ code: 500, message: err })

        data = {
            post_id: feed._id,
            title: feed.title,
            subtitle: feed.subtitle,
            image: feed.image,
            likes: feed.likes.map(user_id => ({
                ...users.find(u => u._id === user_id),
            })),
            total_likes: feed.likes.length,
            comments: feed.comments.map(d => ({
                content: d.content,
                user: users.find(u => u._id === feed.user_id),
                create_time: d.create_time,
            })),
            like_status: ~feed.likes.indexOf(user_id) ? 1 : 0,
            own_feed: feed.user_id === user_id,
            user: users.find(u => u._id === feed.user_id),
            create_time: moment(feed.create_time).fromNow(),
        }
    }

    return Promise.resolve(data)
}

export const deleteFeed = async post_id => {
    const [err] = await to(
        Feeds.update(
            { _id: mTypes.ObjectId(post_id) },
            { $set: { status: FEED_REMOVED } }
        )
    )
    if (err) return Promise.reject({ code: 500, mesage: err })

    return Promise.resolve({ success: 1 })
}

export const insertNewFeed = async (googleID, data) => {
    const newFeeds = new Feeds({
        user_id: googleID,
        ...data,
        status: FEED_AVAILABLE,
    })

    const [err] = await to(newFeeds.save())
    if (err) return Promise.reject({ code: 500, message: err })

    const [errUser, user] = await to(
        User.findOne(
            { googleID },
            { _id: 0, name: 1, profile_img: 1, googleID: 1 }
        )
    )

    let userData = {}

    if (errUser) userData = null
    else
        userData = {
            _id: user.googleID,
            username: user.name,
            avatar: user.profile_img,
        }

    const dt = {
        post_id: newFeeds._id,
        title: newFeeds.title,
        subtitle: newFeeds.subtitle,
        image: newFeeds.image,
        user: userData,
        create_time: moment(newFeeds.create_time).fromNow(),
        likes: [],
        comments: [],
        total_likes: 0,
        own_feed: true,
    }

    sendPushNotification({
        title: dt.title,
        content: dt.user.username || 'A User' + ' has post at new feed!',
        image: dt.image,
        url: '/',
    })

    return Promise.resolve(dt)
}

export const addComment = async (feed, { googleID, content }) => {
    const comment = {
        user_id: googleID,
        content,
        status: 1,
    }

    feed.comments.push(comment)

    const [err, res] = await to(feed.save())
    if (err) return Promise.reject({ code: 500, message: err })

    return Promise.resolve(res._id)
}

export const toggleLike = async (googleID, post_id) => {
    const [err, feed] = await to(Feeds.findOne({ _id: post_id }))
    if (err) return Promise.reject({ code: 500, message: err })

    if (!feed)
        return Promise.reject({
            code: 400,
            message: 'Feed with post_id: ' + post_id + ', not found!',
        })

    const { likes } = feed
    const oldLikes = likes.length
    const indexLikes = likes.indexOf(googleID)

    // Change algorithm to better one,
    // this might causes bugs in the future
    if (~indexLikes) {
        likes.splice(indexLikes, 1)
    } else {
        likes.push(googleID)
    }

    const newLikes = likes.length
    feed.save()

    const like_status = newLikes > oldLikes ? LIKE : UNLIKE

    return Promise.resolve({
        total_likes: newLikes,
        like_status,
    })
}

export const getLocationName = async (lat, lon) => {
    const url = googleMaps.getLocationName
    const query = qs({
        key: GoogleGeocodingAPIKey,
        latlng: lat + ',' + lon,
        result_type: [
            // 'postal_code',
            // 'neighborhood',
            // 'country',
            'street_address',
        ].join('|'),
    })

    const [err, res] = await to(
        fetch(url + query, {
            headers: {
                'content-type': 'application/json',
            },
        })
    )
    if (err) return Promise.reject({ code: 503, message: err })

    const data = await res.json()

    const address = data.results[0] ? data.results[0].formatted_address : ''

    return Promise.resolve({ address })
}
