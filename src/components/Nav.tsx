import { Link } from "react-router-dom";
import colortheme from '../color/colortheme.json';
import { useEffect, useState } from 'react';
import './nav.css'

function Nav() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const lineColor1 = isDarkMode ? colortheme.navbar1.dark : colortheme.navbar1.light;
    const lineColor2 = isDarkMode ? colortheme.navbar2.dark : colortheme.navbar2.light;
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDarkMode);
    }, []);
    return (
        <div className='nav' style={{background: `linear-gradient(to right, ${lineColor2}, ${lineColor1})`}}>
            {/* <h2>HS & B-Farm Dashboard</h2> */}
            <img src="/FarmBlock.png" alt="" height={50} style={{filter: isDarkMode ? 'hue-rotate(55deg)' : 'hue-rotate(0deg)'}} />
            <div className='nav-a' style={{background: "#222222"}}>
                <Link style={{color: isDarkMode ? colortheme.text2.dark : "white"}} to="/">B-Farm</Link>
                <Link style={{color: isDarkMode ? colortheme.text2.dark : "white"}} to="/datasharing">Data sharing</Link>
                <Link style={{color: isDarkMode ? colortheme.text2.dark : "white"}} to="/handysense">HandySense</Link>
            </div>
        </div>
    )
}

export default Nav
