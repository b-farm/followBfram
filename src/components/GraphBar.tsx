import { BarChart } from '@mui/x-charts/BarChart';

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
}
const GraphBar = ({ data }: Prop) => {

    return (

        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: data.map((item) => item.x),
                },
            ]}
            series={[
                {
                    data: data.map((item) => item.y),
                },
            ]}
            height={300}
        />
    )
}

export default GraphBar