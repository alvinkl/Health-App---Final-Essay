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

const data = [
    { name: 'Mo 7', breakfast: 800, lunch: 1000, dinner: 400, snacks: 200 },
    { name: 'Mo 8', breakfast: 700, lunch: 1398, dinner: 210, snacks: 100 },
    { name: 'Mo 9', breakfast: 900, lunch: 1300, dinner: 290, snacks: 100 },
    { name: 'Mo 10', breakfast: 850, lunch: 1000, dinner: 200, snacks: 400 },
    { name: 'Mo 11', breakfast: 750, lunch: 800, dinner: 181, snacks: 100 },
    { name: 'Mo 12', breakfast: 600, lunch: 1200, dinner: 500, snacks: 100 },
    { name: 'Mo 13', breakfast: 1000, lunch: 500, dinner: 100, snacks: 100 },
]

const style = {
    paper: {
        height: '50vh',
        width: '90vw',
        marginTop: '-23vh',
        textAlign: 'center',
        position: 'relative',
    },
    barChart: {
        margin: '0 auto',
        marginTop: '2vh',
    },
}

const Chart = props => {
    return (
        <Paper style={style.paper} zDepth={2}>
            <BarChart
                width={300}
                height={300}
                data={data}
                style={style.barChart}
            >
                <XAxis dataKey="name" />
                <YAxis hide />
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />
                <Bar dataKey="breakfast" stackId="a" fill="#FFCA28" />
                <Bar dataKey="lunch" stackId="a" fill="#03A9F4" />
                <Bar dataKey="dinner" stackId="a" fill="#FF9800" />
                <Bar dataKey="snacks" stackId="a" fill="#8BC34A" />
            </BarChart>
        </Paper>
    )
}

export default Chart
