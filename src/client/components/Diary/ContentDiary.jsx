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

const ContentDiary = ({ title, content }) => {
    return (
        <Card initiallyExpanded={true}>
            <CardHeader title={title} showExpandableButton={true} />
            {content.map((c, i) => (
                <CardText key={i} expandable={true} style={style.cardContent}>
                    <div className={styles.floatLeft}>{c.food_name}</div>
                    <div className={styles.floatRight}>
                        {c.nutrients.calories}
                    </div>
                </CardText>
            ))}
            <CardText expandable={true} style={style.addContent}>
                <div className={styles.floatLeft}>Add {title} Food</div>
                <div className={styles.floatRight}>+</div>
            </CardText>
        </Card>
    )
}

ContentDiary.propTypes = {
    title: T.string.isRequired,
    content: T.arrayOf(T.object),
}

ContentDiary.defaultProps = {
    content: [],
}

export default ContentDiary
