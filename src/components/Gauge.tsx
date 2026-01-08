import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useEffect, useState } from 'react';
import colortheme from '../color/colortheme.json';

type Props = {
    now: number;
    all: number;
}
export default function BasicGauge({ now, all }: Props) {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDarkMode);
    }, []);
    return (
        <Gauge
            width={400}
            min={0}
            max={all}
            height={300}
            value={now}
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
                    fill: isDarkMode ? colortheme.main.dark : colortheme.main.light,
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                    fill: isDarkMode ? '#2f2f2fff' : '#dfdfdfff',
                },
            }}

        />
    );
}
