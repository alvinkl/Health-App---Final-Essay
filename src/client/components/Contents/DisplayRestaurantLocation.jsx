import React from 'react'
import T from 'prop-types'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardActions,
    CardText,
} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const DisplayRestaurantLocation = ({ restaurant, handleAddToDiary }) => {
    const {
        id,
        name,
        cuisines,
        rating,
        price_range,
        url,
        thumbnail,
        menu_url,
        location: { address, locality, city, locatlity_verbose },
    } = restaurant

    return (
        <Card id={id}>
            <CardHeader title={name} subtitle={cuisines} avatar={thumbnail} />
            <CardText>{address}</CardText>
            <CardActions>
                <FlatButton label="Add to Diary" onClick={handleAddToDiary} />
            </CardActions>
        </Card>
    )
}

DisplayRestaurantLocation.propTypes = {
    restaurant: T.object.isRequired,
    handleAddToDiary: T.func.isRequired,
}

export default DisplayRestaurantLocation
