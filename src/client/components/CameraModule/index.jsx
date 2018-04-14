import React, { Component } from 'react'
import cn from 'classnames'
import createRef from 'createref'
import T from 'prop-types'

import to from '@helper/asyncAwait'
import qs from '@helper/queryString'
import { getLocationName, postImage } from '@urls'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

import styles from './cameraModule.css'

class CameraModule extends Component {
    constructor(props) {
        super(props)

        this.videoRef = createRef()
        this.canvasRef = createRef()
    }

    state = {
        picture: null,

        title: '',
        subtitle: '',

        location: null,
        address: '',

        loading_location: false,
        error_location: false,

        error: false,
    }

    componentWillReceiveProps(nextProps) {
        const { camera_module } = nextProps
        if (camera_module) {
            document.querySelector('body').style.overflowY = 'hidden'
            return this.initializeMedia()
        }

        if (document) {
            document.querySelector('body').style.overflowY = 'scroll'
            this.turnOffCamera()
        }
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
        const { addFeedData, user_id } = this.props
        const { title, subtitle, location, address, picture } = this.state

        const picture_name =
            Date.parse(new Date()) / 1000 + '-' + user_id + '.png'

        let postData = new FormData()
        postData.append('file', picture, picture_name)

        // testing upload image
        const res = await fetch(postImage, { method: 'POST', body: postData })
        const { image } = await res.json()

        addFeedData({
            title,
            subtitle,
            location,
            address,
            image,
        })

        this.handleClose()
    }

    initializeMedia = async () => {
        const navigator = window.navigator || {}
        const mediaDevices = navigator.mediaDevices || {}

        if (!('getUserMedia' in mediaDevices)) {
            mediaDevices.getUserMedia = constraints => {
                const getUserMedia =
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia

                if (!getUserMedia)
                    return Promise.reject(
                        new Error('getUserMedia is not implemented!')
                    )

                return new Promise((resolve, reject) =>
                    getUserMedia.call(navigator, constraints, resolve, reject)
                )
            }
        }

        const [err, stream] = await to(
            mediaDevices.getUserMedia({ video: true })
        )
        if (err) return this.setState({ error: true })

        this.videoRef.current.srcObject = stream

        return this.setState({ error: false })
    }

    captureImage = async () => {
        const canvas = this.canvasRef.current
        const videoPlayer = this.videoRef.current

        const context = canvas.getContext('2d')

        context.drawImage(
            videoPlayer,
            0,
            0,
            canvas.width,
            videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
        )

        this.turnOffCamera()

        const picture = this.dataURItoBlob(canvas.toDataURL())

        this.setState({ picture })
    }

    getCurrentLocation = () => {
        if (!('geolocation' in window.navigator)) return

        this.setState({ loading_location: true })
        window.navigator.geolocation.getCurrentPosition(
            async position => {
                console.log(
                    '[GeoLocation] - position retrieved',
                    position.coords
                )
                const { latitude, longitude } = position.coords

                const address = await this.fetchLocationName(
                    latitude,
                    longitude
                )

                this.setState({
                    loading_location: false,
                    location: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    },
                    address,
                })
            },
            async error => {
                // Mock Location for testing purpose
                let location = {
                    lon: 106.7807473,
                    lat: -6.2018556,
                }

                const address = await this.fetchLocationName(
                    location.lat,
                    location.lon
                )

                this.setState({
                    loading_location: false,
                    location,
                    address,
                })

                // this.setState({
                //     loading_location: false,
                //     error_location: true,
                //     location: null,
                // })
            },
            { timeout: 5000, enableHighAccuracy: true, maximumAge: Infinity }
        )
    }

    turnOffCamera = () => {
        const videoPlayer = this.videoRef.current

        if (!videoPlayer) return

        if (videoPlayer.srcObject) {
            videoPlayer.srcObject
                .getVideoTracks()
                .forEach(track => track.stop())
        }
    }

    dataURItoBlob = dataURI => {
        const byteString = atob(dataURI.split(',')[1])
        const mimeString = dataURI
            .split(',')[0]
            .split(':')[1]
            .split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        const blob = new Blob([ab], { type: mimeString })
        return blob
    }

    handleClose = () => {
        const { hideCameraModule } = this.props

        this.turnOffCamera()
        hideCameraModule()

        this.setState({
            picture: null,

            title: '',
            subtitle: '',

            location: null,
            address: '',

            loading_location: false,
            error_location: false,

            error: false,
        })
    }

    handleTitleChange = e => this.setState({ title: e.target.value })
    handleSubtitleChange = e => this.setState({ subtitle: e.target.value })

    render() {
        const {
            error,
            picture,
            loading_location,
            location,
            address,
        } = this.state
        const { camera_module } = this.props

        return (
            <div hidden={!camera_module} className={styles.cameraModule}>
                {!picture && (
                    <video
                        className={styles.cmVideo}
                        id="player"
                        ref={this.videoRef}
                        autoPlay
                    />
                )}

                <canvas
                    className={styles.cmCanvas}
                    id="canvas"
                    ref={this.canvasRef}
                    width="320px"
                    height="240px"
                    hidden={!picture}
                />

                <IconButton
                    className={styles.cmButtonCapture}
                    disabled={!!picture}
                    onClick={this.captureImage}
                >
                    <FontIcon className="material-icons">photo_camera</FontIcon>
                </IconButton>

                <div className={styles.cmTextFields}>
                    <TextField
                        floatingLabelText="Title"
                        onChange={this.handleTitleChange}
                    />
                    <TextField
                        floatingLabelText="Subtitle"
                        onChange={this.handleSubtitleChange}
                    />
                </div>

                {!loading_location &&
                    !location && (
                        <FlatButton
                            className={styles.cmButtonCapture}
                            label="location"
                            onClick={this.getCurrentLocation}
                        />
                    )}

                {loading_location && (
                    <div
                        className={cn(
                            styles.cmButtonCapture,
                            styles.cmTextFields
                        )}
                    >
                        <CircularProgress size={25} />
                    </div>
                )}

                {address && (
                    <FlatButton
                        className={styles.cmButtonCapture}
                        label={address.slice(0, 10) + '...'}
                    />
                )}

                <div className={styles.cmTextFields}>
                    <FlatButton
                        secondary={true}
                        label="Cancel"
                        onClick={this.handleClose}
                    />
                    <FlatButton
                        primary={true}
                        onClick={this.handleSubmitData}
                        label="Post"
                    />
                </div>
            </div>
        )
    }
}

CameraModule.propTypes = {
    camera_module: T.bool.isRequired,
    user_id: T.string.isRequired,

    hideCameraModule: T.func.isRequired,
    addFeedData: T.func.isRequired,
}

import { connect } from 'react-redux'
import { hideCameraModule } from '@actions/common'
import { addFeedData } from '@actions/feeds'

const mapStateToProps = ({
    common: { camera_module },
    user: { googleID },
}) => ({
    camera_module,
    user_id: googleID,
})

const mapDispatchToProps = dispatch => ({
    hideCameraModule: () => dispatch(hideCameraModule()),
    addFeedData: event => dispatch(addFeedData(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraModule)
