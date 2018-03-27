import React from 'react'
import T from 'prop-types'

import {
    Card,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText,
} from 'material-ui/Card'

const DisplayRestaurantLocation = ({ restaurant }) => {
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
        </Card>
    )
}

DisplayRestaurantLocation.propTypes = {
    restaurant: T.object.isRequired,
}

export default DisplayRestaurantLocation
