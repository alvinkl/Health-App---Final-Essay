import React from 'react'
import T from 'prop-types'

import {
    Card,
    CardActions,
    CardHeader,
    CardTitle,
    CardText,
} from 'material-ui/Card'
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'

import styles from './diary.css'

const WorkoutDetail = ({ data, children, expand }) => {
    const {
        name,
        benefits,
        description,
        duration,
        calories_burned,
        photo: { thumbnail, highres },
    } = data

    return (
        <Card className={styles.foodCard} initiallyExpanded={expand}>
            <CardHeader
                title={name}
                subtitle={duration + ' minutes'}
                avatar={thumbnail}
                actAsExpander={true}
                showExpandableButton={true}
            />

            <CardTitle subtitle="Details" expandable={true} />
            <CardText expandable={true}>
                <Table selectable={false}>
                    <TableBody
                        deselectOnClickaway={false}
                        displayRowCheckbox={false}
                    >
                        <TableRow>
                            <TableRowColumn>Description</TableRowColumn>
                            <TableRowColumn>{description}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Benefits</TableRowColumn>
                            <TableRowColumn>{benefits}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Calories Burned</TableRowColumn>
                            <TableRowColumn>{calories_burned}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardText>
            <CardActions>{children}</CardActions>
        </Card>
    )
}

WorkoutDetail.propTypes = {
    data: T.object.isRequired,
    children: T.node,
    expand: T.bool,
}

WorkoutDetail.defaultProps = {
    children: null,
    expand: false,
}

export default WorkoutDetail
