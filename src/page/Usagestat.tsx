import axios from 'axios';
import Nav from "../components/Nav"
import { useEffect, useState } from 'react';
import './usagestat.css'
import GraphBar from '../components/GraphBar';
import GraphLine from '../components/GraphLine';
import ThailandMap from '../components/mapThai';
import ArcDesign from '../components/Gauge';

import colortheme from '../color/colortheme.json';

type DataPoint = { x: string; y: number };
type DataLocation = { region: string; count: number };
type DataDateCount = { date: string; count: number };
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
interface MacInfo {
  _id: string,
  chip_id: string,
  email: string,
  time: string,
}


function Usagestate() {

  const [dates, setDates] = useState<string[]>([])
  const [dailyCounts, setDailyCounts] = useState<number[]>([])
  const [dailyCountall, setDailyCountall] = useState<DataDateCount[]>([])
  const [registCount, setRegistCount] = useState<DataDateCount[]>([])
  const [cumulativeCounts, setCumulativeCounts] = useState<number[]>([])
  // const [dataGraph, setDataGraph] = useState<DataPoint[]>([])
  const [dataGraph2, setDataGraph2] = useState<DataPoint[]>([])
  const [dataGraph3, setDataGraph3] = useState<DataPoint[]>([])
  const [dataGraph4, setDataGraph4] = useState<DataPoint[]>([])
  const [locationCount, setLocationCount] = useState<DataLocation[]>([])
  const [nowHS, setNowHS] = useState<number>(0)
  const [allHS, setAllHS] = useState<number>(0)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const saveTime: Record<string, number> = {};

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
      const cumulativeUsers: Set<string> = new Set();



      data.forEach(item => {
        if (item.region === "Krung Thep") {
          item.region = "Bangkok"
        }
        const date = item.time.split('-').slice(0, 3).join('-'); // Extract YYYY-MM-DD
        if (date >= START_DATE && date <= END_DATE) {
          if (!newUsersPerDay[date]) {
            newUsersPerDay[date] = new Set();
          }
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
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  }

  async function getTodayTimes() {
    const API_URL_MACID = "https://bfarm-api.noip.in.th/macid"
    const response = await axios.get(API_URL_MACID);
    const data: MacInfo[] = response.data;

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    // const yyyy = today.getFullYear();
    // const mm = String(today.getMonth() + 1).padStart(2, '0');
    // const dd = String(today.getDate()).padStart(2, '0');
    // const todayStr = `${yyyy}-${mm}-${dd}`;

    const fiveHoursAgo = new Date(today.getTime() - 1 * 60 * 60 * 1000);
    // const yyyy5 = fiveHoursAgo.getFullYear();
    // const mm5 = String(fiveHoursAgo.getMonth() + 1).padStart(2, '0');
    // const dd5 = String(fiveHoursAgo.getDate()).padStart(2, '0');
    // const hh5 = String(fiveHoursAgo.getHours()).padStart(2, '0');
    // const min5 = String(fiveHoursAgo.getMinutes()).padStart(2, '0');
    // const sec5 = String(fiveHoursAgo.getSeconds()).padStart(2, '0');
    // const fiveHoursAgoStr = `${yyyy5}-${mm5}-${dd5}-${hh5}-${min5}-${sec5}`;

    // const timesWithin5Hours = data
    //   .filter(item => item.time >= fiveHoursAgoStr && item.time <= today.toISOString())
    //   .map(item => item.time);

    function parseCustomDate(str: string) {
      // "2025-10-16-02-25-50" → "2025-10-16T02:25:50"
      const iso = str.replace(/^(\d{4}-\d{2}-\d{2})-(\d{2})-(\d{2})-(\d{2})$/, '$1T$2:$3:$4');
      return new Date(iso);
    }

    const filtered = data.filter(item => {
      const t = parseCustomDate(item.time);
      return t >= fiveHoursAgo && t <= today;
    });

    // Filter records where time is today
    // const timesToday = data
    //   .filter(item => item.time.startsWith(todayStr))
    //   .map(item => item.time);

    setNowHS(filtered.length);
    setAllHS(data.length);
    // return timesToday;
  }

  const userTime = async () => {
    const GOOGLE_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Form%20Responses%201!A:G?key=${GOOGLE_API_KEY}`;

    const response = await axios.get(SHEET_URL);
    const sheetData = response.data;
    Object.keys(saveTime).forEach(key => delete saveTime[key]);

    // const countDate: { date: string; count: number; }[] = [];
    let cumulativeSheetUsers: number = 0;
    sheetData.values.forEach((data: string[], index: number) => {
      if (index === 0) return; // Skip header row
      const readDate = data[0].split(" ")[0];
      saveTime[readDate] = (saveTime[readDate] || cumulativeSheetUsers) + 1;
      cumulativeSheetUsers = saveTime[readDate];
      // if (!saveTime[readDate]) {
      //   saveTime[readDate] = 1;
      //   countDate.push({ date: readDate, count: 1 });
      // } else {
      //   saveTime[readDate]++;
      //   const dateEntry = countDate.find(entry => entry.date === readDate);
      //   if (dateEntry) {
      //     dateEntry.count = saveTime[readDate];
      //   }
      // }
    });
    setRegistCount(saveTime ? Object.entries(saveTime).map(([date, count]) => ({ date, count })) : []);
  };

  useEffect(() => {
    fetchAndPlotNewUsers()
    getTodayTimes()
    userTime()
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDarkMode);
  }, [])

  useEffect(() => {
    // const newGraphData = dates.map((v, i) => ({
    //   x: v,
    //   y: dailyCounts[i]
    // }));
    const newGraphData2 = dates.map((v, i) => ({
      x: v,
      y: cumulativeCounts[i]
    }));
    const newGraphData3 = dailyCountall.map((e) => ({
      x: e.date,
      y: e.count
    }));
    const newGraphData4 = registCount.map((e) => ({
      x: e.date,
      y: e.count
    }));
    setDataGraph2(newGraphData2);
    setDataGraph3(newGraphData3);
    setDataGraph4(newGraphData4);
  }, [cumulativeCounts, dailyCounts, dates, registCount, dailyCountall])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%', background: isDarkMode ? colortheme.background.dark : colortheme.background.light }}>
      <Nav />
      <br />
      <h1 style={{ color: isDarkMode ? colortheme.text1.dark : colortheme.text1.light }}>B-Farm Status</h1>
      <div className='layout' style={{ background: 'none' }}>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <div className='disabletouch'></div>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>
            Registered Users : {Math.max(...dataGraph4.map(item => item.y)) === -Infinity ? 0 : Math.max(...dataGraph4.map(item => item.y)).toLocaleString()}
          </h3>
          <GraphLine data={dataGraph4.filter(item => typeof item.y === 'number' && !isNaN(item.y))} />
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <div className='disabletouch'></div>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>Logged-in B-Farm : {Math.max(...dataGraph2.map(item => item.y)) === -Infinity ? 0 : Math.max(...dataGraph2.map(item => item.y)).toLocaleString()}</h3>
          <GraphLine data={dataGraph2} />
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <div className='disabletouch'></div>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>App Opens : {dataGraph3.map(item => item.y).reduce((acc, cur) => acc + cur, 0).toLocaleString()}</h3>
          <GraphBar data={dataGraph3} />
        </div>
        {/* <div className='block-g'>
          <h3>New users : {Math.max(...dataGraph.map(item => item.y)) === -Infinity ? 0 : Math.max(...dataGraph.map(item => item.y))} New users.</h3>
          <GraphBar data={dataGraph} />
        </div> */}
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <div className='disabletouch'></div>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>HandySense Boards Online.</h3>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>(via B-Farm)</h3>
          <div style={{ justifyItems: 'center', justifyContent: 'center', textAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '4% 0', overflow: 'hidden' }}>
            <ArcDesign now={nowHS} all={allHS} />
          </div>
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>Users in Thailand.</h3>
          <div style={{ padding: '0 20px 16px', height: '400px', overflowX: 'scroll' }}>
            <div className='grid-region-t'>
              <div className='grid-region-t-1' style={{background: isDarkMode ? colortheme.main.dark + "aa" : colortheme.main.light}}>Region</div>
              <div className='grid-region-t-2' style={{background: isDarkMode ? colortheme.main.dark + "66" : colortheme.main.light + "aa"}}>User</div>
            </div>
            {
              locationCount
                .sort((a, b) => b.count - a.count) // or your preferred sort
                .map((v, k) => (
                  <div className='grid-region-d' key={k} style={{ background: k % 2 === 0 ? '#4858ee0f' : '#4858ee08' }}>
                    <h4 style={{ padding: '0 0 0 8%', color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>{v.region}</h4>
                    <h4 style={{ textAlign: 'center', color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>{v.count}</h4>
                  </div>
                ))
            }
          </div>
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>Users in Thailand.</h3>
          <ThailandMap data={locationCount.sort((a, b) => b.count - a.count)} />
        </div>
      </div>
    </div>
  )
}

export default Usagestate
