import { Link } from "react-router-dom";
import './nav.css'

function Nav() {
    return (
        <div className='nav'>
            <h2>B-Farm Dashboard</h2>
            <div className='nav-a'>
                <Link to="/">Usage stat</Link>
                <Link to="/datasharing">Data sharing</Link>
            </div>
        </div>
    )
}

export default Nav
