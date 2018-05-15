import React from 'react'
import T from 'prop-types'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts'

import Paper from 'material-ui/Paper'

import styles from './charts.css'

const Chart = ({
    report,
    workout_report,
    today_total_calories,
    target_calories,
}) => {
    const data = Object.keys(report)
        .sort((a, b) => b - a)
        .map(r => {
            let rt = {
                name: r > 0 ? r + ' days ago' : 'today',
                breakfast: report[r].breakfast,
                lunch: report[r].lunch,
                dinner: report[r].dinner,
                snack: report[r].snack,
            }

            if (workout_report[r])
                rt = {
                    ...rt,
                    workouts: workout_report[r].workouts,
                    total_calories_burned:
                        workout_report[r].total_calories_burned,
                }

            return rt
        })

    return (
        <Paper className={styles.paper} zDepth={2}>
            <div className={styles.alignLeft}>
                <h3>Calories: {today_total_calories}</h3>
                <p>Goal: {target_calories} Calories</p>
            </div>

            <ResponsiveContainer width="100%" height="60%">
                <BarChart
                    data={data}
                    className={styles.barChart}
                    maxBarSize={1000}
                >
                    <XAxis dataKey="name" />
                    <YAxis hide />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <ReferenceLine y={target_calories} stroke="#8BC34A" />
                    <ReferenceLine y={target_calories - 200} stroke="#FF9800" />
                    <ReferenceLine y={target_calories / 2} stroke="#03A9F4" />
                    <ReferenceLine y={target_calories / 4} stroke="#FFCA28" />
                    <Legend />
                    <Bar dataKey="breakfast" stackId="a" fill="#FFCA28" />
                    <Bar dataKey="lunch" stackId="a" fill="#03A9F4" />
                    <Bar dataKey="dinner" stackId="a" fill="#FF9800" />
                    <Bar dataKey="snack" stackId="a" fill="#8BC34A" />
                    <Bar
                        dataKey="total_calories_burned"
                        stackId="b"
                        fill="red"
                    />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    )
}

Chart.propTypes = {
    report: T.object.isRequired,
    workout_report: T.object.isRequired,
    today_total_calories: T.number.isRequired,
    target_calories: T.number.isRequired,
}

Chart.defaultProps = {
    today_total_calories: 0,
    target_calories: 0,
}

import { connect } from 'react-redux'

const mapStateToProps = ({
    diary: { report, today_total_calories },
    user: {
        diet_plan: { target_calories },
    },
    workout: { workout_report },
}) => ({
    report,
    today_total_calories: today_total_calories,
    target_calories,
    workout_report,
})

export default connect(mapStateToProps)(Chart)
