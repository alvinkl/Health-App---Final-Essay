import React, { Component } from 'react'
import T from 'prop-types'
import createRef from 'createref'
import cn from 'classnames'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import dataURItoBlob from '@helper/dataURItoBlob'
import { getLocationName, postImage } from '@urls'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import styles from './addFeed.css'

class ImagePickModule extends Component {
    constructor() {
        super()
        this.canvasRef = createRef()
    }

    state = {
        title: '',
        subtitle: '',
        picture: null,
        location: null,
        address: '',
    }

    componentDidMount() {
        this.fetchLocation()
    }

    fetchLocation = async () => {
        let location = {
            lon: 106.7807473,
            lat: -6.2018556,
        }

        const address = await this.fetchLocationName(location.lat, location.lon)

        this.setState({
            loading_location: false,
            location,
            address,
        })
    }

    fetchLocationName = async (lat, lon) => {
        const url = getLocationName
        const query = qs({
            lat,
            lon,
        })

        const [, res] = await to(
            fetch(url + query, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'same-origin',
            })
        )

        if (!res) return ''

        const { address } = await res.json()

        return address
    }

    handleSubmitData = async () => {
        const {
            addFeedData,
            user_id,
            showLoader,
            hideLoader,
            handleBackButton,
        } = this.props
        const { title, subtitle, location, address, picture } = this.state

        showLoader()

        const picture_name =
            Date.parse(new Date()) / 1000 + '-' + user_id + '.png'

        addFeedData({
            title,
            picture: {
                picture_name,
                picture_blob: picture,
            },
            subtitle,
            location,
            address,
        })

        hideLoader()

        handleBackButton()
    }

    handleTitleChange = e => this.setState({ title: e.target.value })
    handleSubtitleChange = e => this.setState({ subtitle: e.target.value })

    handleAddImage = e => {
        const picture = e.target.files[0]
        if (picture) {
            const canvas = this.canvasRef.current
            const context = canvas.getContext('2d')

            context.clearRect(0, 0, canvas.width, canvas.height)

            const url = window.URL.createObjectURL(picture)
            const img = new Image()

            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height)

                this.setState({ picture: dataURItoBlob(canvas.toDataURL()) })
            }

            img.src = url
        }
    }

    render() {
        const { title, subtitle, picture } = this.state

        return (
            <div className={styles.imagePickerWrapper}>
                <canvas
                    className={styles.cmCanvas}
                    id="canvas"
                    ref={this.canvasRef}
                    width="320px"
                    height="240px"
                />

                <RaisedButton
                    className={cn(
                        styles.uploadImageButton,
                        styles.cmButtonCapture
                    )}
                    label="Choose an Image"
                    labelPosition="before"
                    containerElement="label"
                >
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={this.handleAddImage}
                    />
                </RaisedButton>

                <div className={styles.cmTextFields}>
                    <TextField
                        floatingLabelText="Title"
                        value={title}
                        onChange={this.handleTitleChange}
                    />
                    <TextField
                        floatingLabelText="Subtitle"
                        value={subtitle}
                        onChange={this.handleSubtitleChange}
                    />
                </div>

                <div className={styles.cmTextFields}>
                    <FlatButton
                        primary={true}
                        onClick={this.handleSubmitData}
                        label="Post"
                        disabled={!title || !subtitle || !picture}
                    />
                </div>
            </div>
        )
    }
}

ImagePickModule.propTypes = {
    user_id: T.string.isRequired,

    handleBackButton: T.func.isRequired,

    showLoader: T.func.isRequired,
    hideLoader: T.func.isRequired,
    showSnackbar: T.func.isRequired,
    addFeedData: T.func.isRequired,
}

import { connect } from 'react-redux'
import { showLoader, hideLoader, showSnackbar } from '@actions/common'
import { addFeedData } from '@actions/feeds'

const mapStateToProps = ({ user: { googleID } }) => ({
    user_id: googleID,
})

const mapDispatchToProps = dispatch => ({
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    showSnackbar: event => dispatch(showSnackbar(event)),
    addFeedData: event => dispatch(addFeedData(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImagePickModule)
