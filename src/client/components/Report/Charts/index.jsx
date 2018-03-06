import React from 'react'
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

const data = [
    { name: 'Mo 7', breakfast: 800, lunch: 1000, dinner: 400, snacks: 200 },
    { name: 'Mo 8', breakfast: 700, lunch: 1398, dinner: 210, snacks: 100 },
    { name: 'Mo 9', breakfast: 900, lunch: 1300, dinner: 290, snacks: 100 },
    { name: 'Mo 10', breakfast: 850, lunch: 1000, dinner: 200, snacks: 400 },
    { name: 'Mo 11', breakfast: 750, lunch: 800, dinner: 181, snacks: 100 },
    { name: 'Mo 12', breakfast: 600, lunch: 1200, dinner: 500, snacks: 100 },
    { name: 'Mo 13', breakfast: 1000, lunch: 500, dinner: 100, snacks: 100 },
]

const Chart = props => {
    return (
        <Paper className={style.paper} zDepth={2}>
            <div className={style.alignLeft}>
                <h3>Calories</h3>
                <h2>15870</h2>
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

export default Chart
