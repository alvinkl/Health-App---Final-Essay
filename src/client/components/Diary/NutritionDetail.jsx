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

const NutritionDetail = ({ data, children, expand }) => {
    const {
        name,
        quantity,
        total_weight,
        unit,
        nutrients,
        alternative_measure,
        photo: { thumbnail, highres },
    } = data

    return (
        <Card className={styles.foodCard} initiallyExpanded={expand}>
            <CardHeader
                title={name}
                subtitle={quantity + ' ' + unit}
                avatar={thumbnail}
                actAsExpander={true}
                showExpandableButton={true}
            />

            <CardTitle subtitle="Nutritions" expandable={true} />
            <CardText expandable={true}>
                <Table selectable={false}>
                    <TableBody
                        deselectOnClickaway={false}
                        displayRowCheckbox={false}
                    >
                        {Object.keys(nutrients).map((nutrient, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{nutrient}</TableRowColumn>
                                <TableRowColumn>
                                    {nutrients[nutrient] || 0}
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardText>
            <CardActions>{children}</CardActions>
        </Card>
    )
}

NutritionDetail.propTypes = {
    data: T.object.isRequired,
    children: T.node,
    expand: T.bool,
}

NutritionDetail.defaultProps = {
    children: null,
    expand: false,
}

export default NutritionDetail
