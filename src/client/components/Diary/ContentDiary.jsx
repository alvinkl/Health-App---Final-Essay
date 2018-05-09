import React from 'react'
import T from 'prop-types'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import styles from './diary.css'

const style = {
    cardContent: {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        border: '1px solid grey',
    },
    addContent: {
        backgroundColor: '#00bcd4',
        color: 'white',
        marginTop: '.5vh',
    },
}

const ContentDiary = ({ title, content, handleOpen, keyLeft, keyRight }) => (
    <Card initiallyExpanded={true}>
        <CardHeader title={title} showExpandableButton={true} />
        {content.map((c, i) => {
            const leftLabel = keyLeft.reduce(
                (p, k) => (typeof p === 'object' ? p[k] : p),
                c
            )
            const rightLabel = keyRight.reduce(
                (p, k) => (typeof p === 'object' ? p[k] : p),
                c
            )

            return (
                <CardText
                    key={i}
                    expandable={true}
                    style={style.cardContent}
                    onClick={handleOpen.bind(null, c)}
                >
                    <div className={styles.floatLeft}>{leftLabel}</div>
                    <div className={styles.floatRight}>{rightLabel}</div>
                </CardText>
            )
        })}
    </Card>
)

ContentDiary.propTypes = {
    title: T.string.isRequired,
    content: T.arrayOf(T.object),
    keyLeft: T.array.isRequired,
    keyRight: T.array.isRequired,

    handleOpen: T.func.isRequired,
}

ContentDiary.defaultProps = {
    content: [],
}

export default ContentDiary
