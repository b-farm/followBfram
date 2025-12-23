import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import mapDataThailand from '../../data/thailand.json';

type DataLocation = { region: string; count: number };

const ThailandMap = ({ data }: { data: DataLocation[] }) => {
    // Build a mapping from province names to map keys (e.g., 'Bangkok' -> 'th-bk')
    const nameToKey: Record<string, string> = {};
    (mapDataThailand.features || []).forEach((feature: any) => {
        if (feature.properties && feature.properties['name'] && feature.properties['hc-key']) {
            nameToKey[feature.properties['name']] = feature.properties['hc-key'];
        }
    });

    // Convert data to [hc-key, count] format
    const mappedData: [string, number][] = data
        .map(({ region, count }) => {
            const key = nameToKey[region];
            return key ? [key, count] : null;
        })
        .filter((item): item is [string, number] => !!item);

    interface MapSeriesData {
        type: 'map';
        name: string;
        data: [string, number][];
        states: {
            hover: {
                color: string;
            };
        };
        dataLabels: {
            enabled: boolean;
            format: string;
        };
    }

    const options: Highcharts.Options = {
        chart: { map: mapDataThailand as any },
        title: { text: '' },
        colorAxis: {
            min: 0,
            stops: [[0, 'var(--color-light)'], [0.5, '#4858ee'], [1, '#aa0000']],
        },
        series: [{
            type: 'map',
            name: 'Number of Users',
            data: mappedData,
            states: { hover: { color: '#e3008c' } },
            dataLabels: { enabled: false, format: '{point.value}' }
        } as MapSeriesData]
    };
    return (
        <HighchartsReact
            constructorType="mapChart"
            highcharts={Highcharts}
            options={options}
        />
    )
};

export default ThailandMap;
