import React, { Component } from 'react'

import to from '@helper/asyncAwait'

class CameraModule extends Component {
    state = {
        error: false,
    }

    componentDidMount() {
        this.initializeMedia()
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

        this.refs.video.srcObject = stream

        return this.setState({ error: false })
    }

    initializeCanvas = async () => {
        const canvas_element = this.refs.canvas
        const video_player = this.refs.video

        const context = canvas_element.getContext('2d')

        context.drawImage(
            video_player,
            0,
            0,
            canvas_element.width,
            video_player.videoHeight /
                (video_player.videoWidth / canvas_element.width)
        )

        video_player.srcObject.getVideoTracks().forEach(track => {
            track.stop()
        })

        const picture = this.dataURItoBlob(canvasElement.toDataURL())
        // console.log(picture)
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

    render() {
        const { error } = this.state
        return (
            <div>
                <video id="player" ref="video" autoPlay />
                <canvas id="canvas" ref="canvas" width="320px" height="240px" />
                <button
                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    id="capture-btn"
                >
                    Capture
                </button>

                {error && (
                    <div id="pick-image">
                        <h6>Pick an Image instead</h6>
                        <input type="file" accept="image/*" id="image-picker" />
                    </div>
                )}
            </div>
        )
    }
}

export default CameraModule
