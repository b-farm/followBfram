import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from "../components/Nav"
import './usagestat.css'
import ThailandMap from '../components/mapThai';
import hs_data from '../data/HS_piya_1.json';
import { useTheme } from '../contexts/ThemeContext';

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
  const { colors } = useTheme();
  const [provinceData, setProvinceData] = useState<ProvinceInfo[]>([]);
  const [hsNetpieData, setHsNetpieData] = useState<hsnetpieprops>({ user: 0, project: 0, device: 0, timestamp: "" });

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
    fetchProvince();
    fetchHSNetpie();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%', background: colors.background, color: colors.text1, minHeight: '100vh' }}>
      <Nav />
      <br />
      <h1 style={{ color: colors.text1 }}>HandySense Boards in Thailand.</h1>
      {/* <h3>Total boards: {hs.reduce((acc, curr) => acc + curr.hs_board_count, 0)}</h3> */}
      <h4 style={{ color: colors.text1 }}>Last Updated: {hsNetpieData.timestamp ? new Date(parseInt(hsNetpieData.timestamp)).toLocaleString() : ''}</h4>
      <div className='layout' style={{background: 'none'}}>
        <div className='block-g' style={{ padding: 0, background: 'none', display: "grid", gridTemplateColumns: "auto", gap: "12px" }}>
          <div className='block-g' style={{ padding: '12px 0 32px', background: colors.backgroundcard }}>
            <h3 style={{ color: colors.text2, fontWeight: 300 }}>Total Users</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: colors.main }}>{hsNetpieData.user.toLocaleString()}</h1>
          </div>
          <div className='block-g' style={{ padding: '12px 0 32px', background: colors.backgroundcard }}>
            <h3 style={{ color: colors.text2, fontWeight: 300 }}>Devices Connected</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: colors.main }}>{hsNetpieData.device.toLocaleString()}</h1></div>
          <div className='block-g' style={{ padding: '12px 0 32px', background: colors.backgroundcard }}>
            <h3 style={{ color: colors.text2, fontWeight: 300 }}>NETPIE Projects</h3>
            <h1 style={{ padding: 0, fontSize: '2.4rem', color: colors.main }}>{hsNetpieData.project.toLocaleString()}</h1>
          </div>
        </div>
        <div className='block-g' style={{ background: colors.backgroundcard }}>
          <h3 style={{ color: colors.text2, fontWeight: 300, fontSize: '1rem', paddingBottom: '8px' }}>Number of devices sold in each province.</h3>
          <div style={{ padding: '0 20px 16px', height: '350px', overflowX: 'scroll' }}>
            <div className='grid-region-t'>
              <div className='grid-region-t-1' style={{background: colors.main + "aa"}}>Region</div>
              <div className='grid-region-t-2' style={{background: colors.main + "66"}}>User</div>
            </div>
            {
              hs
                .sort((a, b) => b.hs_board_count - a.hs_board_count) // or your preferred sort
                .map((v, k) => (
                  <div className='grid-region-d' key={k} style={{ background: k % 2 === 0 ? '#4858ee0f' : '#4858ee08' }}>
                    <h4 style={{ padding: '0 0 0 8%', color: colors.text2 }}>{changeProvinceName(v.province)}</h4>
                    <h4 style={{ textAlign: 'center', color: colors.text2 }}>{v.hs_board_count}</h4>
                  </div>
                ))
            }
          </div>
        </div>
        <div className='block-g' style={{ background: colors.backgroundcard }}>
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
