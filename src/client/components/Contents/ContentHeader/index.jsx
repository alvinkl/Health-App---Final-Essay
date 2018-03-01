import React from 'react'
import T from 'prop-types'

import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import { GridList, GridTile } from 'material-ui/GridList'
import Chip from 'material-ui/Chip'
import FontIcon from 'material-ui/FontIcon'

import styles from '../contents.css'

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

const ContentHeader = ({
    user: {
        user_id,
        user_name,
        profile_img,

        dietary_plan: {
            target_calories,
            current_calories,
            target_weight,
            current_weight,
        },
    },
}) => {
    let $avatar = ''
    if (profile_img)
        $avatar = (
            <Avatar size={55} src={profile_img} className={styles.avatarUser} />
        )
    else
        $avatar = (
            <Avatar size={55} className={styles.avatarUser}>
                {user_name[0]}
            </Avatar>
        )

    return (
        <Paper className={styles.userBar} zDepth={3} id={user_id}>
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
                            &nbsp;{current_calories} / {target_calories}
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
                            &nbsp;{current_weight}
                        </Chip>
                        <Chip style={style.chip}>
                            <FontIcon
                                className="material-icons"
                                style={style.fontIconSize}
                            >
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                    </div>
                </GridTile>
            </GridList>
        </Paper>
    )
}

import { connect } from 'react-redux'

const mapStateToProps = state => ({
    user: state.user,
})

export default ContentHeader
