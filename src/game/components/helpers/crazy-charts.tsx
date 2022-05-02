import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

export const chartColors: string[] = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)'
]

export function CrazyPieChart(props: {
    label: string,
    maxSize?: string,
    data: [string, number][]
}) {
    const pieData = {
        labels: props.data.map(d => d[0]),
        datasets: [
            {
                data: props.data.map(d => d[1]),
                backgroundColor: chartColors,
                borderColor: chartColors,
                borderWidth: 2
            }
        ],
        options: {
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 16
                        },
                        color: 'rgb(255,255,255)'
                    }
                }
            }
        }
    }
    return <Pie style={{ maxWidth: props.maxSize, maxHeight: props.maxSize }} data={pieData} />
}