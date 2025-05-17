import axios from 'axios';
import Nav from "./components/Nav"
import { useEffect, useState } from 'react';
import './App.css'
import GraphBar from './components/GraphBar';

type DataPoint = { x: string; y: number };
type DataLocation = { region: string; count: number };
type DataUserDaily = { date: string; count: number };
interface DeviceInfo {
  _id: string;
  name: string;
  ip: string;
  time: string;
  lat: string;
  lng: string;
  city: string;
  region: string;
}


function App() {

  const [dates, setDates] = useState<string[]>([])
  const [dailyCounts, setDailyCounts] = useState<number[]>([])
  const [dailyCountall, setDailyCountall] = useState<DataUserDaily[]>([])
  const [cumulativeCounts, setCumulativeCounts] = useState<number[]>([])
  const [dataGraph, setDataGraph] = useState<DataPoint[]>([])
  const [dataGraph2, setDataGraph2] = useState<DataPoint[]>([])
  const [dataGraph3, setDataGraph3] = useState<DataPoint[]>([])
  const [locationCount, setLocationCount] = useState<DataLocation[]>([])

  async function fetchAndPlotNewUsers() {
    // const API_URL = '/api/usage';
    const API_URL = "https://bfarm-api.noip.in.th/usage";
    const today = new Date();
    const START_DATE = '2025-02-15';
    const END_DATE = today.toISOString().split('T')[0];
    try {
      const response = await axios.get(API_URL);
      const data: DeviceInfo[] = response.data;

      const newUsersPerDay: Record<string, Set<string>> = {};
      const allNewUsers: Set<string> = new Set();
      const uniqueNames: Set<string> = new Set();
      const regionCount: Record<string, number> = {};
      const userDairyCount: Record<string, number> = {};
      // const dates: string[] = [];
      // const dailyCounts: number[] = [];
      // const cumulativeCounts: number[] = [];
      const cumulativeUsers: Set<string> = new Set();



      data.forEach(item => {
        if (item.region === "Krung Thep") {
          item.region = "Bangkok"
        }
        const date = item.time.split('-').slice(0, 3).join('-'); // Extract YYYY-MM-DD
        if (date >= START_DATE && date <= END_DATE) {
          if (!newUsersPerDay[date]) {
            newUsersPerDay[date] = new Set();
            // console.log(date)
          }
          // console.log(item.name)
          newUsersPerDay[date].add(item.name);
          allNewUsers.add(item.name);
          userDairyCount[date] = (userDairyCount[date] || 0) + 1;
          if (!uniqueNames.has(item.name)) {
            uniqueNames.add(item.name);
            regionCount[item.region] = (regionCount[item.region] || 0) + 1;
          }
        }
      });
      setDates([]);
      setDailyCounts([]);
      setCumulativeCounts([]);
      setLocationCount([]);
      setDailyCountall([]);

      Object.entries(newUsersPerDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([date, users]) => {
          const before = cumulativeUsers.size;
          users.forEach(user => cumulativeUsers.add(user));
          const added = cumulativeUsers.size - before;
          const nowuser = cumulativeUsers.size;

          // console.log(`${date} - Users: ${users.size}, new: ${added}, Cumulative: ${cumulativeUsers.size}`);

          // dates.push(date);
          // dailyCounts.push(added);
          // cumulativeCounts.push(cumulativeUsers.size);
          setDates(prev => [...prev, date]);
          setDailyCounts(prev => [...prev, added]);
          setCumulativeCounts(prev => [...prev, nowuser]);
        });
      Object.entries(regionCount).map(([region, count]) => {
        setLocationCount((prev) => [...prev, { region: region, count: count }])
      })
      Object.entries(userDairyCount).sort(([a], [b]) => a.localeCompare(b)).forEach(([date, count]) => {
        setDailyCountall((prev) => [...prev, { date: date, count: count }])
      })

      // return { dates, dailyCounts, cumulativeCounts };

      // console.log(START_DATE)
      // console.log(END_DATE)
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  }

  useEffect(() => {
    fetchAndPlotNewUsers()
  }, [])

  useEffect(() => {
    console.log(dates)
    console.log(dailyCounts)
    console.log(cumulativeCounts)
    console.log(dailyCountall)
    const newGraphData = dates.map((v, i) => ({
      x: v,
      y: dailyCounts[i]
    }));
    const newGraphData2 = dates.map((v, i) => ({
      x: v,
      y: cumulativeCounts[i]
    }));
    const newGraphData3 = dailyCountall.map((e) => ({
      x: e.date,
      y: e.count
    }));
    setDataGraph(newGraphData);
    setDataGraph2(newGraphData2);
    setDataGraph3(newGraphData3);
  }, [cumulativeCounts, dailyCounts, dates])


  // const data: DataPoint[] = [
  //   { x: '1', y: 12 },
  //   { x: '2', y: 16 },
  //   { x: '3', y: 10 },
  //   { x: '4', y: 13 },
  //   { x: '5', y: 11 },
  // ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
      <Nav />
      <div className='layout'>

        <div className='g-graph' >
          <h3>Total {Math.max(...cumulativeCounts)} users.</h3>
          <GraphBar data={dataGraph2} />
          <h3>New users per day.</h3>
          <GraphBar data={dataGraph} />
          <h3>Number of usage.</h3>
          <GraphBar data={dataGraph3} />
          {/* <Graphcontent data={dataGraph} bar={true} topic="New user each a day" />
        <Graphcontent data={dataGraph2} bar={false} topic="Cumulative user" /> */}
        </div>
        <div className='g-list'>
          <div style={{}}>
            <h3>Users per region : </h3>
            <br />
            <div className='grid-region-t'>
              {/* <h4 style={{ padding: 0, margin: 0, paddingLeft: '16px' }} key={i}>{v.region} : {v.count}</h4> */}
              <div className='grid-region-t-1'>Region</div>
              <div className='grid-region-t-2'>User</div>
            </div>
            {
              locationCount
                .sort((a, b) => b.count - a.count) // or your preferred sort
                .map((v) => (
                  <div className='grid-region-d' key={v.region}>
                    <h4>{v.region}</h4>
                    <h4 style={{ textAlign: 'center' }}>{v.count}</h4>
                  </div>
                ))
            }

          </div>
          {/* <div style={{ background: '#fff', padding: '20px 10vw 20px 20px', margin: '20px 0 0vh 20px', height: 'fit-content' }}>
            <h2>Total number of users.</h2>
            <h2></h2>
          </div> */}
        </div>
        <br />
        <br />
      </div>
    </div>
  )
}

export default App
