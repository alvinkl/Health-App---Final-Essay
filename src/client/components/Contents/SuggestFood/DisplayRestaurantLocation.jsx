import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import { MEAL_TYPE } from '@constant'
import { getRestaurantMapLocation } from '@urls'
import to from '@helper/asyncAwait'
import qs from '@helper/queryString'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardActions,
    CardText,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Popover from 'material-ui/Popover/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'

const style = {
    img: {
        width: '100%'
    }
}

class DisplayRestaurantLocation extends Component {
    state = {
        open: false,
        mapURL: '',
    }

    componentDidMount() {
        this.fetchStaticMapURL()
    }

    fetchStaticMapURL = async () => {
        const { restaurant: { lat, lon } } = this.props

        const query = qs({
            lat,
            lon,
        })
        const [err, res] = await to(
            fetch(getRestaurantMapLocation + query, {
                method: 'GET',
                headers: { 'accept-content': 'application/json' },
                credentials: 'same-origin',
            })
        )
        if (err) return

        const data = await res.json()
        if (data) {
            const mapURL = data.url
            this.setState({ mapURL })
        }
    }

    // use when fetching google static maps returns buffer instead of url
    fetchStaticMap = async () => {
        const { restaurant: { lat, lon } } = this.props

        const query = qs({
            lat,
            lon,
        })
        const [err, res] = await to(
            fetch(getRestaurantMapLocation + query, {
                method: 'GET',
                headers: { 'accept-content': 'application/json' },
                credentials: 'same-origin',
            })
        )
        if (err) return

        const data = await res.json()
        if (data) {
            const b64 = this.arrayBufferToBase64(data.buffer.data)
            const mapURL = 'data:image/jpeg;base64,' + b64
            this.setState({ mapURL })
        }
    }

    arrayBufferToBase64(buffer) {
        let binary = ''
        const bytes = [].slice.call(new Uint8Array(buffer))

        bytes.forEach(b => (binary += String.fromCharCode(b)))

        return window.btoa(binary)
    }

    handleAddDiary = (_, value) => {
        const { handleAddToDiary } = this.props

        handleAddToDiary(value)
        this.setState({ open: false })
    }

    handleClickAddDiary = event =>
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        })

    closePopover = () => this.setState({ open: false })

    render() {
        const {
            restaurant: {
                restaurant_id,
                name,
                cuisines,
                lat,
                lon,
                keywords,
                address,
                url,
                thumbnail,
            },
            handleBackButton,
        } = this.props
        const { open, anchorEl, mapURL } = this.state

        return (
            <Card id={restaurant_id}>
                <CardHeader
                    title={name}
                    subtitle={cuisines}
                    avatar={thumbnail}
                />
                <CardText>
                    {mapURL && <img src={mapURL} alt="map" style={style.img} />}
                    {address}
                </CardText>
                <CardActions>
                    <Fragment>
                        <FlatButton
                            primary
                            onClick={this.handleClickAddDiary}
                            label="Add to Diary"
                        />
                        <FlatButton
                            secondary
                            onClick={handleBackButton}
                            label="Back"
                        />
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onRequestClose={this.closePopover}
                            anchorOrigin={{
                                horizontal: 'middle',
                                vertical: 'center',
                            }}
                            targetOrigin={{
                                horizontal: 'middle',
                                vertical: 'center',
                            }}
                        >
                            <Menu onChange={this.handleAddDiary}>
                                <MenuItem
                                    value={MEAL_TYPE.BREAKFAST}
                                    primaryText="Breakfast"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.LUNCH}
                                    primaryText="Lunch"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.DINNER}
                                    primaryText="Dinner"
                                />
                                <MenuItem
                                    value={MEAL_TYPE.SNACK}
                                    primaryText="Snack"
                                />
                            </Menu>
                        </Popover>
                    </Fragment>
                </CardActions>
            </Card>
        )
    }
}

DisplayRestaurantLocation.propTypes = {
    restaurant: T.object.isRequired,
    handleAddToDiary: T.func.isRequired,
    handleBackButton: T.func.isRequired,
}

export default DisplayRestaurantLocation
