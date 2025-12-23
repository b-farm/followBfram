import { Link } from "react-router-dom";
import './nav.css'

function Nav() {
    return (
        <div className='nav'>
            {/* <h2>HS & B-Farm Dashboard</h2> */}
            <img src="/FarmBlock.png" alt="" height={50} />
            <div className='nav-a'>
                <Link to="/">B-Farm</Link>
                <Link to="/datasharing">Data sharing</Link>
                <Link to="/handysense">HandySense</Link>
            </div>
        </div>
    )
}

export default Nav
