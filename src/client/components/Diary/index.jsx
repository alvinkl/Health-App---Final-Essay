import React, { Component } from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import TextField from 'material-ui/TextField'

import ContentDiary from './ContentDiary'
import styles from './diary.css'

import { fetchTodayDiary } from '@actions/diary'

class Diary extends Component {
    state = {
        diary: {},
        loading: false,
    }

    static initialAction = store => {
        store.dispatch(fetchTodayDiary())
    }

    static propTypes = {
        diary: T.object.isRequired,
        fetchTodayDiary: T.func.isRequired,
    }

    componentDidMount() {
        const { diary } = this.state
        const { fetchTodayDiary } = this.props
        if (isEmpty(diary)) fetchTodayDiary()
    }

    componentWillReceiveProps(nextProps) {
        const { diary } = nextProps
        if (!isEmpty(diary)) this.setState({ diary })
    }

    renderBreakfast = () => {
        const { breakfast } = this.state.diary

        return <ContentDiary title="Breakfast" content={breakfast} />
    }

    renderLunch = () => {
        const { lunch } = this.state.diary

        return <ContentDiary title="Lunch" content={lunch} />
    }

    renderDinner = () => {
        const { dinner } = this.state.diary

        return <ContentDiary title="Dinner" content={dinner} />
    }

    renderSnack = () => {
        const { snack } = this.state.diary

        return <ContentDiary title="Snack" content={snack} />
    }

    render() {
        return (
            <div>
                <div className={styles.headerInput}>
                    <TextField
                        className={styles.searchField}
                        id="food-search"
                        hintText="What have you eat?"
                    />
                </div>
                <div className={styles.content}>
                    {this.renderBreakfast()}
                    {this.renderLunch()}
                    {this.renderDinner()}
                    {this.renderSnack()}
                </div>
            </div>
        )
    }
}

import { connect } from 'react-redux'

const mapStateToProps = ({ diary }) => ({
    diary,
})

const mapDispatchToProps = dispatch => ({
    fetchTodayDiary: () => dispatch(fetchTodayDiary()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Diary)
