import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import ContentHeader from './ContentHeader'
import SuggestFood from './SuggestFood/SuggestFoodMenu'
import Feeds from './Feeds'

import { fetchUserData } from '@actions/user'
import { fetchFeed } from '@actions/feeds'
import { fetchDailyCalories } from '@actions/diary'
// import styles from './contents.css'

const increment_decrement_weight = 0.1
const increment_decrement_calories = 50

class Contents extends Component {
    state = {
        page: 1,

        open_dialog: false,
        dialog_data: {},
        DialogComp: null,
    }

    static initialAction = store => {
        return store.dispatch(fetchUserData())
    }

    componentDidMount() {
        const {
            user,
            fetchUserData,
            fetchFeed,
            fetchDailyCalories,
        } = this.props
        const { page } = this.state

        if (!user.googleID) fetchUserData()

        fetchFeed(page)
        fetchDailyCalories()
    }

    handleOpenDialog = (dialog_data, dialog_type = '') => {
        const { DialogComp } = this.state
        let newState = {
            open_dialog: true,
            dialog_data,
            dialog_type,
        }

        if (!DialogComp) {
            newState = {
                ...newState,
                DialogComp: require('./DialogContent').default,
            }
        }

        this.setState(newState)
    }
    handleCloseDialog = () =>
        this.setState({ open_dialog: false, dialog_data: {}, dialog_type: '' })

    handleSubmitWeightChange = value => {
        const { updateUserWeight } = this.props

        updateUserWeight()
    }

    handleSubmitCaloriesChange = value => {
        const { updateUserTargetCalories } = this.props

        updateUserTargetCalories()
    }

    render() {
        const { feeds } = this.props
        const { DialogComp, open_dialog, dialog_data, dialog_type } = this.state

        return (
            <Fragment>
                <ContentHeader
                    key="content-header"
                    {...{
                        handleOpenDialog: this.handleOpenDialog,
                    }}
                />
                <SuggestFood />
                <Feeds data={feeds} />

                {!!DialogComp && (
                    <DialogComp
                        key="content-dialog"
                        {...{
                            open_dialog,
                            dialog_data,
                            handleCloseDialog: this.handleCloseDialog,
                            increment_decrement_value:
                                dialog_type === 'weight'
                                    ? increment_decrement_weight
                                    : increment_decrement_calories,
                            handleSubmit:
                                dialog_type === 'weight'
                                    ? this.handleSubmitWeightChange
                                    : this.handleSubmitCaloriesChange,
                            type: dialog_type,
                        }}
                    />
                )}
            </Fragment>
        )
    }
}

Contents.propTypes = {
    // from redux
    user: T.object.isRequired,
    feeds: T.array.isRequired,

    fetchUserData: T.func.isRequired,
    fetchFeed: T.func.isRequired,
    fetchDailyCalories: T.func.isRequired,

    updateUserWeight: T.func.isRequired,
    updateUserTargetCalories: T.func.isRequired,
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { connect } from 'react-redux'
import { updateUserWeight, updateUserTargetCalories } from '@actions/user'

const mapStateToProps = ({ user, feeds: { feeds } }) => ({
    user,
    feeds,
})

const mapDispatchToProps = dispatch => ({
    fetchUserData: event => dispatch(fetchUserData(event)),
    fetchFeed: event => dispatch(fetchFeed(event)),
    fetchDailyCalories: () => dispatch(fetchDailyCalories()),
    updateUserWeight: event => dispatch(updateUserWeight(event)),
    updateUserTargetCalories: event =>
        dispatch(updateUserTargetCalories(event)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Contents)
