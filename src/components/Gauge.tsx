import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

type Props = {
    now: number;
    all: number;
}
export default function BasicGauge({ now, all }: Props) {
    return (
        <Gauge
            width={400}
            min={0}
            max={all}
            height={300}
            value={now}
            startAngle={0}
            text={`${now} / ${all}`}
            cornerRadius="50%"
            style={{overflow: 'hidden'}}
            sx={{
                [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: 'var(--color-main)',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#f4f5fe',
                },
            }}
        />
    );
}
