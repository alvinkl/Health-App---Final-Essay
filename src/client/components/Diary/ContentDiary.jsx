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

const ContentDiary = ({ title, content, handleOpen }) => (
    <Card initiallyExpanded={true}>
        <CardHeader title={title} showExpandableButton={true} />
        {content.map((c, i) => (
            <CardText
                key={i}
                expandable={true}
                style={style.cardContent}
                onClick={handleOpen.bind(null, c)}
            >
                <div className={styles.floatLeft}>{c.name}</div>
                <div className={styles.floatRight}>{c.nutrients.calories}</div>
            </CardText>
        ))}
    </Card>
)

ContentDiary.propTypes = {
    title: T.string.isRequired,
    content: T.arrayOf(T.object),

    handleOpen: T.func.isRequired,
}

ContentDiary.defaultProps = {
    content: [],
}

export default ContentDiary
