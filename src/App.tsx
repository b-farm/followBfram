import axios from 'axios';
import Graphcontent from "./components/Graph"
import Nav from "./components/Nav"
import { useEffect, useState } from 'react';
import './App.css'

type DataPoint = { x: string; y: number };
type DataLocation = { region: string; count: number };
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
  const [cumulativeCounts, setCumulativeCounts] = useState<number[]>([])
  const [dataGraph, setDataGraph] = useState<DataPoint[]>([])
  const [dataGraph2, setDataGraph2] = useState<DataPoint[]>([])
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
    const newGraphData = dates.map((v, i) => ({
      x: v,
      y: dailyCounts[i]
    }));
    const newGraphData2 = dates.map((v, i) => ({
      x: v,
      y: cumulativeCounts[i]
    }));
    setDataGraph(newGraphData);
    setDataGraph2(newGraphData2);
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
      <div className='g-graph' >
        <Graphcontent data={dataGraph} bar={true} topic="New user each a day" />
        <Graphcontent data={dataGraph2} bar={false} topic="Cumulative user" />
      </div>
      <div className='g-list'>
        <div style={{ background: '#fff', padding: '20px 10vw 20px 20px', margin: '20px 0 0vh 20px' }}>
          <h2>Users per region : </h2>
          {
            locationCount.map((v, i) =>
              (<h3 style={{ padding: 0, margin: 0, paddingLeft: '16px' }} key={i}>{v.region} : {v.count}</h3>))
          }
        </div>
        <div style={{ background: '#fff', padding: '20px 10vw 20px 20px', margin: '20px 0 0vh 20px', height: 'fit-content' }}>
          <h2>Total number of users : {cumulativeCounts.at(-1)} users</h2>
          <h2></h2>
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}

export default App
