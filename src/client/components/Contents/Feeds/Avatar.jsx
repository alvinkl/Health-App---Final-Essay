import React from 'react'

import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'

const style = {
    avatar: {
        margin: 5,
    },
    list: {
        height: 50,
    },
    listItem: {
        height: 50,
    },
}

const AvatarStacks = props => {
    return (
        <List style={style.list}>
            <ListItem style={style.listItem}>
                <Avatar size={30} style={style.avatar}>
                    A
                </Avatar>
            </ListItem>
        </List>
    )
}

export default AvatarStacks
