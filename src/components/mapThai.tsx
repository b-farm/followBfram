import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import mapDataThailand from '../../data/thailand.json';
import { useTheme } from '../contexts/ThemeContext';

type DataLocation = { region: string; count: number };

const ThailandMap = ({ data }: { data: DataLocation[] }) => {
    const { isDarkMode, colors } = useTheme();
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
        chart: { map: mapDataThailand as any, backgroundColor: 'none' },
        title: { text: '' },
        colorAxis: {
            min: 0,
            stops: [[0, colors.main], [1, '#ff0000']],
        },
        series: [{
            type: 'map',
            name: 'Number of Users',
            data: mappedData,
            nullColor: isDarkMode ? '#202020ff' : '#f0f0f0ff',
            borderWidth: 1,
            borderColor: isDarkMode ? '#444444' : '#cccccc',
            states: { hover: { color: '#e3008c' } },
            dataLabels: { 
                enabled: false, 
                format: '{point.value}',
                color: isDarkMode ? '#ffffff' : '#000000'
            }

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
