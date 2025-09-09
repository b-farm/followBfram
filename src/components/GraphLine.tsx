import { LineChart } from '@mui/x-charts/LineChart'

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
    log?: boolean;
}
const GraphLine = ({ data, log }: Prop) => {

    const timeToNum = (time: string) => {
        const thisTime = new Date(time);
        return Math.floor(thisTime.getTime() / 1000);
    }
    const minX = Math.min(...data.map((item) => timeToNum(item.x)));
    const maxX = Math.max(...data.map((item) => timeToNum(item.x)));

    return (
        <LineChart
            xAxis={[
                {
                    data: data.map((item) => timeToNum(item.x)),
                    valueFormatter: (value: number) => {
                        const date = new Date(value * 1000);
                        return date.getDate() + '/' + Number(date.getMonth() + 1) + '/'  + date.getFullYear();
                    },
                    min: minX,
                    max: maxX,
                },
            ]}
            series={[
                {
                    data: data.map((item) => item.y),
                    area: true,
                    showMark: false,
                    curve: 'linear', // Use linear curve for low curvature
                },
            ]}
            height={300}
            skipAnimation
            yAxis={[{ scaleType: log ? 'log' : 'linear' }]}
        />
    )
}

export default GraphLine