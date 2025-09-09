import { BarChart } from '@mui/x-charts/BarChart';

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
}
const GraphBar = ({ data }: Prop) => {
    const timeToNum = (time: string) => {
        const thisTime = new Date(time);
        return Math.floor(thisTime.getTime() / 1000);
    }

    return (

        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: data.map((item) => timeToNum(item.x)),
                    valueFormatter: (value: number) => {
                        const date = new Date(value * 1000);
                        return date.getDate() + '/' + Number(date.getMonth() + 1) + '/'  + date.getFullYear();
                    },
                },
            ]}
            series={[
                {
                    data: data.map((item) => item.y),
                },
            ]}
            height={300}
            skipAnimation
        />
    )
}

export default GraphBar