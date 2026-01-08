import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../contexts/ThemeContext';

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
}
const GraphBar = ({ data }: Prop) => {
    const { isDarkMode, colors } = useTheme();
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
                        return date.getDate() + '/' + Number(date.getMonth() + 1) + '/' + date.getFullYear();
                    },
                },
            ]}
            series={[
                {
                    data: data.map((item) => item.y),
                    color: colors.main,
                },
            ]}
            height={300}
            skipAnimation
            disableAxisListener
            sx={{
                // tick labels (ตัวเลขบนแกน)
                '.MuiChartsAxis-tickLabel': {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
                '.MuiChartsAxis-tickLabel tspan': {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },

                // axis label (ชื่อแกน ถ้ามี)
                '.MuiChartsAxis-label': {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
                '.MuiChartsAxis-label tspan': {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },

                // เส้นแกน
                '.MuiChartsAxis-line': {
                    stroke: isDarkMode ? '#ffffff' : '#000000',
                },

                // ขีด tick
                '.MuiChartsAxis-tick': {
                    stroke: isDarkMode ? '#ffffff' : '#000000',
                },
            }}

        />
    )
}

export default GraphBar