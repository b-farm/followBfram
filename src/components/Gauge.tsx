import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';

type Props = {
    now: number;
    all: number;
}
export default function BasicGauge({ now, all }: Props) {
    const { isDarkMode, colors } = useTheme();
    const [valueGauge, setValueGauge] = useState(0);
    useEffect(() => {
        console.log('now', now, 'all', all);
        if (all !== 0) {
            setValueGauge((now / all) * 100);
        }
    }, [now, all]);
    return (
        <Gauge
            width={400}
            min={0}
            max={all}
            height={300}
            value={valueGauge}
            startAngle={0}
            text={`${now} / ${all}`}
            color={isDarkMode ? '#ffffff' : '#000000'}
            cornerRadius="50%"
            style={{ overflow: 'hidden' }}
            sx={{
                [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
                [`& .${gaugeClasses.valueText} tspan`]: {
                    fill: isDarkMode ? '#ffffff' : '#000000',
                },
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: colors.main,
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                    fill: isDarkMode ? '#2f2f2fff' : '#dfdfdfff',
                },
            }}

        />
    );
}
