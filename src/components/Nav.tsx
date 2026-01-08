import { Link } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';
import './nav.css'

function Nav() {
    const { isDarkMode, colors, toggleTheme } = useTheme();
    return (
        <div className='nav' style={{ background: `linear-gradient(to right, ${colors.navbar2}, ${colors.navbar1})` }}>
            {/* <h2>HS & B-Farm Dashboard</h2> */}
            <img src="/FarmBlock.png" alt="" height={50} style={{ filter: isDarkMode ? 'hue-rotate(55deg)' : 'hue-rotate(0deg)' }} />
            <div onClick={toggleTheme} style={{ fontSize: '1.5rem', cursor: 'pointer', color: colors.text3, position: 'absolute', right: '20px' }}>{isDarkMode ? '🌙' : '☀️'}</div>
            <div className='nav-a' >
                <Link style={{ color: colors.text3 }} to="/">B-Farm</Link>
                <Link style={{ color: colors.text3 }} to="/datasharing">Data sharing</Link>
                <Link style={{ color: colors.text3 }} to="/handysense">HandySense</Link>
            </div>
        </div>
    )
}

export default Nav
