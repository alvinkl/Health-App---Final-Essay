import React from 'react'
import T from 'prop-types'
import { isEmpty } from 'lodash'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

import Paper from 'material-ui/Paper'

import style from './charts.css'

const Chart = ({ report, today_total_calories }) => {
    const data = Object.keys(report)
        .sort((a, b) => b - a)
        .map(r => ({
            name: r > 0 ? r + ' days ago' : 'today',
            breakfast: report[r].breakfast,
            lunch: report[r].lunch,
            dinner: report[r].dinner,
            snack: report[r].snack,
        }))

    return (
        <Paper className={style.paper} zDepth={2}>
            <div className={style.alignLeft}>
                <h3>Calories</h3>
                <h2>{today_total_calories}</h2>
                <div>
                    <p>Daily Average: 2267</p>
                    <p>Goal: 2555kcal</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="60%">
                <BarChart data={data} className={style.barChart}>
                    <XAxis dataKey="name" />
                    <YAxis hide />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="breakfast" stackId="a" fill="#FFCA28" />
                    <Bar dataKey="lunch" stackId="a" fill="#03A9F4" />
                    <Bar dataKey="dinner" stackId="a" fill="#FF9800" />
                    <Bar dataKey="snacks" stackId="a" fill="#8BC34A" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    )
}

Chart.propTypes = {
    report: T.object.isRequired,
    today_total_calories: T.string.isRequired,
}

import { connect } from 'react-redux'

const mapStateToProps = ({ diary }) => ({
    report: diary.report,
    today_total_calories: diary.today_total_calories,
})

export default connect(mapStateToProps)(Chart)
