import React, { Component, Fragment } from 'react'
import T from 'prop-types'

import Divider from 'material-ui/Divider'

import ContentHeader from './ContentHeader'
import SuggestFood from './SuggestFood/SuggestFoodMenu'
import Feeds from './Feeds'

import { fetchUserData } from '@actions/user'
import { fetchFeed } from '@actions/feeds'
import { fetchDailyCalories } from '@actions/diary'

import styles from './contents.css'

const increment_decrement_weight = 0.1
const increment_decrement_calories = 50

class Contents extends Component {
    state = {
        page: 1,

        open_dialog: false,
        dialog_data: {},
        dialog_type: '',
        DialogComp: null,

        open_delete_dialog: false,
        delete_event: null,
        DeleteConfirmationComp: null,

        open_suggest_food_dialog: false,
        suggested_calories: 0,
        SuggestCalorieDialog: null,
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
                DialogComp: require('@components/Dialogs/Content').default,
            }
        }

        this.setState(newState)
    }
    handleCloseDialog = () =>
        this.setState({ open_dialog: false, dialog_data: {}, dialog_type: '' })

    handleSubmitWeightChange = value => {
        const { updateUserWeight } = this.props
        const { dialog_type } = this.state

        updateUserWeight({ type: dialog_type, value })
        this.handleCloseDialog()
    }

    handleSubmitCaloriesChange = target_calories => {
        const { updateUserTargetCalories } = this.props

        updateUserTargetCalories(target_calories)
        this.handleCloseDialog()
    }

    handleOpenDeleteConfirmation = delete_event => {
        const { DeleteConfirmationComp } = this.state

        let newState = {
            open_delete_dialog: true,
            delete_event,
        }

        if (!DeleteConfirmationComp)
            newState = {
                ...newState,
                DeleteConfirmationComp: require('@components/Dialogs/DeleteConfirmation')
                    .default,
            }

        this.setState(newState)
    }
    handleCloseDeleteConfirmation = () =>
        this.setState({ open_delete_dialog: false, delete_event: null })

    handleOpenSuggestCaloriesDialog = () => {
        const { SuggestCalorieDialog } = this.state
        let newState = {
            open_suggest_food_dialog: true,
        }

        if (!SuggestCalorieDialog)
            newState = {
                ...newState,
                SuggestCalorieDialog: require('@components/Dialogs/Content')
                    .default,
            }

        this.setState(newState)
    }
    handleCloseSuggestCaloriesDialog = () =>
        this.setState({
            open_suggest_food_dialog: false,
            suggested_calories: 0,
        })

    handleSubmitSuggestCalories = suggested_calories =>
        this.setState({ suggested_calories, open_suggest_food_dialog: false })

    renderSuggestCaloriesDialog = () => {
        const { SuggestCalorieDialog, open_suggest_food_dialog } = this.state

        return (
            SuggestCalorieDialog && (
                <SuggestCalorieDialog
                    open_dialog={open_suggest_food_dialog}
                    dialog_data={{ title: 'Calories needed', value: 500 }}
                    increment_decrement_value={50}
                    handleCloseDialog={this.handleCloseSuggestCaloriesDialog}
                    handleSubmit={this.handleSubmitSuggestCalories}
                />
            )
        )
    }

    renderDialogContent = () => {
        const {
            user: {
                diet_plan: {
                    current_weight: { value: cw },
                    target_weight: { value: tw },
                },
            },
        } = this.props
        const { DialogComp, open_dialog, dialog_data, dialog_type } = this.state

        let increment_decrement_value = 0
        let min_value = 0
        let max_value = 0
        if (~dialog_type.indexOf('weight')) {
            increment_decrement_value = increment_decrement_weight
            if (~dialog_type.indexOf('target')) {
                min_value = cw
                max_value = 200
            } else {
                min_value = 45
                max_value = tw
            }
        } else {
            increment_decrement_value = increment_decrement_calories
            min_value = 500
            max_value = 5000
        }

        return (
            !!DialogComp && (
                <DialogComp
                    key="content-dialog"
                    {...{
                        open_dialog,
                        dialog_data,
                        handleCloseDialog: this.handleCloseDialog,
                        handleSubmit: ~dialog_type.indexOf('weight')
                            ? this.handleSubmitWeightChange
                            : this.handleSubmitCaloriesChange,
                        type: dialog_type,
                        increment_decrement_value,
                        min_value,
                        max_value,
                    }}
                />
            )
        )
    }

    renderDeleteConfirmation = () => {
        const {
            DeleteConfirmationComp,
            open_delete_dialog,
            delete_event,
        } = this.state

        return (
            !!DeleteConfirmationComp && (
                <DeleteConfirmationComp
                    key="delete-confirmation-content"
                    {...{
                        open: open_delete_dialog,
                        deleteEvent: delete_event,
                        handleClose: this.handleCloseDeleteConfirmation,
                    }}
                />
            )
        )
    }

    render() {
        const { feeds, lazy_loading } = this.props
        const { suggested_calories } = this.state

        return (
            <Fragment>
                <ContentHeader
                    key="content-header"
                    {...{
                        handleOpenDialog: this.handleOpenDialog,
                    }}
                />
                <SuggestFood
                    onClick={this.handleOpenSuggestCaloriesDialog}
                    suggested_calories={suggested_calories}
                />
                <Feeds
                    data={feeds}
                    handleOpenDeleteConfirmation={
                        this.handleOpenDeleteConfirmation
                    }
                />

                {lazy_loading && (
                    <div className={styles.loadingMoreContent}>
                        <Divider />
                        <h4>Loading more content...</h4>
                    </div>
                )}

                {this.renderDialogContent()}

                {this.renderDeleteConfirmation()}

                {this.renderSuggestCaloriesDialog()}
            </Fragment>
        )
    }
}

Contents.propTypes = {
    // from redux
    user: T.object.isRequired,
    feeds: T.array.isRequired,
    lazy_loading: T.bool.isRequired,

    fetchUserData: T.func.isRequired,
    fetchFeed: T.func.isRequired,
    fetchDailyCalories: T.func.isRequired,

    updateUserWeight: T.func.isRequired,
    updateUserTargetCalories: T.func.isRequired,
}

// import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { connect } from 'react-redux'
import { updateUserWeight, updateUserTargetCalories } from '@actions/user'

const mapStateToProps = ({ user, feeds: { feeds, lazy_loading } }) => ({
    user,
    feeds,
    lazy_loading,
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
