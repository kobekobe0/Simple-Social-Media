import React from 'react'
import { Link } from 'react-router-dom'
function TopNav(props) {
    return (
        <div className="topNav" style={{ height: '5vh' }}>
            <Link
                to="/"
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    margin: '0',
                    fontSize: '20px',
                }}
            >
                DUMPS
            </Link>
        </div>
    )
}

export default TopNav
