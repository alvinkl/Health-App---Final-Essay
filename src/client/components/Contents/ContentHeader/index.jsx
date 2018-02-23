import React from 'react'

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
    },
    smallChip: {
        margin: 4,
        width: '14vw',
    },
}

const ContentHeader = props => {
    return (
        <Paper className={styles.userBar} zDepth={3}>
            <GridList cols={3} className={styles.gridList}>
                <GridTile cols={0.7}>
                    <Avatar size={55} className={styles.avatarUser}>
                        A
                    </Avatar>
                </GridTile>
                <GridTile cols={1.15}>
                    <div className={styles.wrapper}>
                        <Chip style={style.chip}>
                            <FontIcon className="material-icons">
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                        <Chip style={style.chip}>
                            <FontIcon className="material-icons">
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                    </div>
                </GridTile>
                <GridTile cols={1.15}>
                    <div className={styles.wrapper}>
                        <Chip style={style.chip}>
                            <FontIcon className="material-icons">
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                        <Chip style={style.smallChip}>
                            <FontIcon className="material-icons">
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                        <Chip style={style.smallChip}>
                            <FontIcon className="material-icons">
                                &#xE56C;
                            </FontIcon>
                        </Chip>
                    </div>
                </GridTile>
            </GridList>
        </Paper>
    )
}

export default ContentHeader
