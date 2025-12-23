import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from "../components/Nav"
import './usagestat.css'
import ThailandMap from '../components/mapThai';
import hs_data from '../data/HS_piya_1.json';

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


function HSstat() {
  const [provinceData, setProvinceData] = useState<ProvinceInfo[]>([]);

  const fetchProvince = async () => {
    try {
      const response = await axios.get<ProvinceInfo[]>('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      setProvinceData(response.data);
    } catch (error) {
      console.error('Error fetching province data:', error);
    }
  };

  const changeProvinceName = (provinceThai: string): string => {
    const province = provinceData.find(p => p.name_th === provinceThai);
    return province ? province.name_en : provinceThai;
  }

  const hs: HSInfo[] = hs_data;

  useEffect(() => {
    fetchProvince();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      <Nav />
      <br />
      <h1>HandySense Boards in Thailand.</h1>
      <h3>Total boards: {hs.reduce((acc, curr) => acc + curr.hs_board_count, 0)}</h3>
      <h4>Last Updated: 12 Nov 2025</h4>
      <div className='layout'>
        <div className='block-g'>
          <div style={{ padding: '0 20px 16px', height: '400px', overflowX: 'scroll' }}>
            <div className='grid-region-t'>
              <div className='grid-region-t-1'>Province</div>
              <div className='grid-region-t-2'>User</div>
            </div>
            {
              hs
                .sort((a, b) => b.hs_board_count - a.hs_board_count) // or your preferred sort
                .map((v, k) => (
                  <div className='grid-region-d' key={k} style={{ background: k % 2 === 0 ? '#4858ee0f' : '#4858ee08' }}>
                    <h4 style={{ padding: '0 0 0 8%' }}>{changeProvinceName(v.province)}</h4>
                    <h4 style={{ textAlign: 'center' }}>{v.hs_board_count}</h4>
                  </div>
                ))
            }
          </div>
        </div>
        <div className='block-g'>
          <ThailandMap data={hs.map((data) => ({
            region: changeProvinceName(data.province),
            count: data.hs_board_count,
          })).sort((a, b) => b.count - a.count)} />
        </div>
      </div>
    </div>
  )
}

export default HSstat
