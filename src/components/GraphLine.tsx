import { LineChart } from '@mui/x-charts/LineChart'
import { useTheme } from '../contexts/ThemeContext';

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
    log?: boolean;
}
const GraphLine = ({ data, log }: Prop) => {
    const { isDarkMode, colors } = useTheme();

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
                        return date.getDate() + '/' + Number(date.getMonth() + 1) + '/' + date.getFullYear();
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
                    color: colors.main,
                },
            ]}
            height={300}
            skipAnimation
            yAxis={[{ scaleType: log ? 'log' : 'linear' }]}
            sx={{
                '& .MuiAreaElement-root': {
                    fill: `url(#gradient-${isDarkMode ? 'dark' : 'light'})`,
                },

                // tick labels (ตัวเลขแกน)
                '.MuiChartsAxis-tickLabel': {
                    fill: isDarkMode ? '#cccccc' : '#000000',
                },
                '.MuiChartsAxis-tickLabel tspan': {
                    fill: isDarkMode ? '#cccccc' : '#000000',
                },

                // axis label (ชื่อแกน ถ้ามี)
                '.MuiChartsAxis-label': {
                    fill: isDarkMode ? '#cccccc' : '#000000',
                },
                '.MuiChartsAxis-label tspan': {
                    fill: isDarkMode ? '#cccccc' : '#000000',
                },

                // เส้นแกน + ขีด tick
                '.MuiChartsAxis-line': {
                    stroke: isDarkMode ? '#666666' : '#000000',
                },
                '.MuiChartsAxis-tick': {
                    stroke: isDarkMode ? '#666666' : '#000000',
                },
            }}

        >
            <defs>
                <linearGradient id={`gradient-${isDarkMode ? 'dark' : 'light'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colors.main} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={colors.main} stopOpacity={0.1} />
                </linearGradient>
            </defs>
        </LineChart>
    )
}

export default GraphLine