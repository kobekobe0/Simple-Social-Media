import React from 'react'
import { useAuth } from '../../../context/authContext'
import './nav.css'
import { useHistory } from 'react-router-dom'
function Nav(props) {
    const { logout, currentUser } = useAuth()
    const history = useHistory()

    const goToProfile = () => {
        history.push('/profile')
    }
    return (
        <nav className="nav">
            <div className="userInfoPreview">
                <img
                    src={currentUser.photoURL}
                    style={{
                        width: '50px',
                        borderRadius: '25px',
                        height: '50px',
                        objectFit: 'cover',
                    }}
                />
                <h3 className="username">{currentUser.displayName}</h3>
            </div>

            <button
                className="profileBtn"
                onClick={() => props.changeDisplay(2)}
            >
                Home
            </button>
            <button className="homeBtn" onClick={goToProfile}>
                Profile
            </button>
            <button
                onClick={() => props.changeDisplay(1)}
                className="messageBtn"
            >
                Messages
            </button>
            <button className="logoutBtn" onClick={logout}>
                Logout
            </button>
        </nav>
    )
}

export default Nav
