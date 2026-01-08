import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from "../components/Nav"
import './usagestat.css'
import ThailandMap from '../components/mapThai';
import hs_data from '../data/HS_piya_1.json';
import colortheme from '../color/colortheme.json';

interface HSInfo {
  province: string,
  region: string,
  hs_board_count: number,
}

interface ProvinceInfo {
  id: number,
  name_th: string,
  name_en: string,
  geography_id: number,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
}

interface hsnetpieprops {
  user: number,
  project: number,
  device: number,
  timestamp: string,
}


function HSstat() {
  const [provinceData, setProvinceData] = useState<ProvinceInfo[]>([]);
  const [hsNetpieData, setHsNetpieData] = useState<hsnetpieprops>({ user: 0, project: 0, device: 0, timestamp: "" });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const fetchProvince = async () => {
    try {
      const response = await axios.get<ProvinceInfo[]>('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      setProvinceData(response.data);
    } catch (error) {
      console.error('Error fetching province data:', error);
    }
  };

  const fetchHSNetpie = async () => {
    try {
      const response = await axios.get<hsnetpieprops>('https://summary.handysense.io/report.json');
      setHsNetpieData(response.data);
    } catch (error) {
      console.error('Error fetching HS Netpie data:', error);
    }
  };

  const changeProvinceName = (provinceThai: string): string => {
    const province = provinceData.find(p => p.name_th === provinceThai);
    return province ? province.name_en : provinceThai;
  }

  const hs: HSInfo[] = hs_data;

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDarkMode);
    fetchProvince();
    fetchHSNetpie();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%', background: isDarkMode ? colortheme.background.dark : colortheme.background.light, color: isDarkMode ? colortheme.text1.dark : colortheme.text1.light, minHeight: '100vh' }}>
      <Nav />
      <br />
      <h1 style={{ color: isDarkMode ? colortheme.text1.dark : colortheme.text1.light }}>HandySense Boards in Thailand.</h1>
      {/* <h3>Total boards: {hs.reduce((acc, curr) => acc + curr.hs_board_count, 0)}</h3> */}
      <h4 style={{ color: isDarkMode ? colortheme.text1.dark : colortheme.text1.light }}>Last Updated: {hsNetpieData.timestamp ? new Date(parseInt(hsNetpieData.timestamp)).toLocaleString() : ''}</h4>
      <div className='layout' style={{background: 'none'}}>
        <div className='block-g' style={{ padding: 0, background: 'none', display: "grid", gridTemplateColumns: "auto", gap: "12px" }}>
          <div className='block-g' style={{ padding: '12px 0 32px', background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
            <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light, fontWeight: 300 }}>Total Users</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: isDarkMode ? colortheme.main.dark : colortheme.main.light }}>{hsNetpieData.user.toLocaleString()}</h1>
          </div>
          <div className='block-g' style={{ padding: '12px 0 32px', background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
            <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light, fontWeight: 300 }}>Devices Connected</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: isDarkMode ? colortheme.main.dark : colortheme.main.light }}>{hsNetpieData.device.toLocaleString()}</h1></div>
          <div className='block-g' style={{ padding: '12px 0 32px', background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
            <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light, fontWeight: 300 }}>NETPIE Projects</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: isDarkMode ? colortheme.main.dark : colortheme.main.light }}>{hsNetpieData.project.toLocaleString()}</h1>
          </div>
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <h3 style={{ color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light, fontWeight: 300, fontSize: '1rem', paddingBottom: '8px' }}>Number of devices sold in each province.</h3>
          <div style={{ padding: '0 20px 16px', height: '350px', overflowX: 'scroll' }}>
            <div className='grid-region-t'>
              <div className='grid-region-t-1' style={{background: isDarkMode ? colortheme.main.dark + "aa" : colortheme.main.light}}>Region</div>
              <div className='grid-region-t-2' style={{background: isDarkMode ? colortheme.main.dark + "66" : colortheme.main.light + "aa"}}>User</div>
            </div>
            {
              hs
                .sort((a, b) => b.hs_board_count - a.hs_board_count) // or your preferred sort
                .map((v, k) => (
                  <div className='grid-region-d' key={k} style={{ background: k % 2 === 0 ? '#4858ee0f' : '#4858ee08' }}>
                    <h4 style={{ padding: '0 0 0 8%', color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>{changeProvinceName(v.province)}</h4>
                    <h4 style={{ textAlign: 'center', color: isDarkMode ? colortheme.text2.dark : colortheme.text2.light }}>{v.hs_board_count}</h4>
                  </div>
                ))
            }
          </div>
        </div>
        <div className='block-g' style={{ background: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light }}>
          <ThailandMap data={hs.map((data) => ({
            region: changeProvinceName(data.province),
            count: data.hs_board_count,
          })).sort((a, b) => b.count - a.count)} />
        </div>
      </div>
      <br />
      <br />
    </div >
  )
}

export default HSstat
