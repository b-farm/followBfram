import Plot from 'react-plotly.js';

type DataPoint = { x: string; y: number };
interface Prop {
    data: DataPoint[];
    bar: boolean;
    topic: string;
}

const Graphcontent = ({ data, bar, topic }: Prop) => {
    const k_screen = screen.width > screen.height ? 0.45 : 0.88;
    return (
        <div>
            <Plot
                data={[
                    {
                        x: data.map((item) => item.x), // Convert timestamps to ISO strings
                        y: data.map((item) => item.y),
                        // type: 'scatter', // Graph type (e.g., scatter, line, bar)
                        // mode: 'lines+markers', // Style (lines, markers, or both)
                        // marker: { color: ' #304674' }, // Marker customization
                        type: bar ? 'bar' : 'scatter', // Changed to bar chart
                        mode: bar ? 'none' : 'lines+markers',
                        marker: { color: 'var(--color-main)' },
                    },
                ]}
                layout={{
                    title: {
                        text: topic, // <-- Your topic/title here
                        font: {
                            size: 18,
                        },
                        x: 0.5, // Center the title
                    },
                    margin: { t: 60, r: 30, b: 30, l: 30 }, // Remove all margins
                    showlegend: false, // Hide legend
                    width: screen.width * k_screen,
                    height: screen.width * k_screen / 1.5
                }}
                config={{
                    displayModeBar: false, // Disable mode bar
                    responsive: true, // Make the chart responsive
                    staticPlot: screen.width > screen.height ? false : true,
                }}
                style={{ zIndex: '0', position: 'relative', borderRadius: '10px' }} // Optional styling
            />
        </div>
    );
};

export default Graphcontent;
