import { LineChart } from '@mui/x-charts/LineChart'

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
}
const GraphLine = ({ data }: Prop) => {

    const timeToNum = (time: string) => {
        const thisTime = new Date(time);
        return Math.floor(thisTime.getTime() / 1000);
    }
    // Find min x (date) and min y
    const minX = Math.min(...data.map((item) => timeToNum(item.x)));

    return (
        <LineChart
            xAxis={[
                {
                    data: data.map((item) => timeToNum(item.x)),
                    valueFormatter: (value: number) => {
                        const date = new Date(value * 1000);
                        return date.getDate() + '/' + date.getMonth() + '/'  + date.getFullYear();
                    },
                    min: minX,
                },
            ]}
            series={[
                {
                    data: data.map((item) => item.y),
                    area: true,
                    showMark: false,
                },
            ]}
            height={300}
            skipAnimation
        />
    )
}

export default GraphLine