import React from 'react'
import T from 'prop-types'

import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import { GridList, GridTile } from 'material-ui/GridList'
import Chip from 'material-ui/Chip'
import FontIcon from 'material-ui/FontIcon'
import { cyan100, cyan500 } from 'material-ui/styles/colors'

import styles from './contents.css'

const style = {
    chip: {
        margin: 4,
        width: '30vw',
        height: '100%',
    },
    majorChip: {
        width: '46vw',
        height: '100%',
    },
    smallChip: {
        margin: 4,
        width: '14vw',
    },
    fontIconSize: {
        fontSize: '14px',
    },
}

const ContentHeader = ({ user, today_total_calories, showCameraModule }) => {
    const {
        googleID,
        name,
        profile_img,

        diet_plan: {
            target_calories,
            target_weight: { value: target_weight },
            current_weight: { value: current_weight },
        },
    } = user

    let $avatar = ''
    if (profile_img)
        $avatar = (
            <Avatar size={55} src={profile_img} className={styles.avatarUser} />
        )
    else
        $avatar = (
            <Avatar size={55} className={styles.avatarUser}>
                {name[0]}
            </Avatar>
        )

    return (
        <Paper className={styles.userBar} zDepth={3} id={googleID}>
            <GridList cols={3} className={styles.gridList}>
                <GridTile cols={0.7}>{$avatar}</GridTile>
                <GridTile cols={2.3}>
                    <div className={styles.wrapper}>
                        <Chip style={style.majorChip}>
                            <FontIcon
                                className="material-icons"
                                style={style.fontIconSize}
                            >
                                &#xE56C;
                            </FontIcon>
                            &nbsp;{today_total_calories} / {target_calories}
                            &nbsp;calories
                        </Chip>
                        <Chip style={style.smallChip}>
                            <FontIcon
                                className="material-icons"
                                style={style.fontIconSize}
                            >
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                    </div>

                    <div className={styles.wrapper}>
                        <Chip style={style.chip}>
                            <FontIcon
                                className="material-icons"
                                style={style.fontIconSize}
                            >
                                accessibility
                            </FontIcon>
                            &nbsp;{current_weight} / {target_weight} kg
                        </Chip>
                        <Chip
                            style={style.chip}
                            color={cyan500}
                            backgroundColor={cyan100}
                            onClick={showCameraModule}
                        >
                            <FontIcon
                                className="material-icons"
                                style={style.fontIconSize}
                            >
                                add_a_photo
                            </FontIcon>
                            &nbsp; Add Photo
                        </Chip>
                    </div>
                </GridTile>
            </GridList>
        </Paper>
    )
}

ContentHeader.propTypes = {
    user: T.object,
    today_total_calories: T.string.isRequired,
    showCameraModule: T.func.isRequired,
}

ContentHeader.defaultProps = {
    user: {},
}

import { connect } from 'react-redux'
import { showCameraModule } from '@actions/common'

const mapStateToProps = ({ user, diary }) => ({
    user,
    today_total_calories: diary.today_total_calories,
})

const mapDispatchToProps = dispatch => ({
    showCameraModule: () => dispatch(showCameraModule()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentHeader)