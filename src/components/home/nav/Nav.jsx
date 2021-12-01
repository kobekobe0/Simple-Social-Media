import React from 'react'
import { useAuth } from '../../../context/authContext'
import './nav.css'
import { useHistory } from 'react-router-dom'
import { RiHomeLine } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { BiMessageAlt } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'

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
                <p className="navButtonText">Home</p>
                <RiHomeLine size={20} />
            </button>
            <button className="homeBtn" onClick={goToProfile}>
                <p className="navButtonText">Profile</p>
                <AiOutlineUser size={20} />
            </button>
            <button
                onClick={() => props.changeDisplay(1)}
                className="messageBtn"
            >
                <p className="navButtonText">Messages</p>
                <BiMessageAlt size={20} />
            </button>
            <button className="logoutBtn" onClick={logout}>
                <p className="navButtonText">Logout</p>
                <FiLogOut size={20} />
            </button>
        </nav>
    )
}

export default Nav
