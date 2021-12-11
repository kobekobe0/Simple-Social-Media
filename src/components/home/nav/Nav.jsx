import React from 'react'
import { useAuth } from '../../../context/authContext'
import './nav.css'
import { useHistory } from 'react-router-dom'
import { RiHomeLine } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { BiMessageAlt, BiSearch } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'
import { MdLandscape } from 'react-icons/md'
import { FaDumpster } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Nav(props) {
    const { logout, currentUser } = useAuth()
    const history = useHistory()
    const [futureUse, setFutureUse] = React.useState(false)

    const goToProfile = () => {
        history.push('/profile')
    }

    const goToSearch = () => {
        history.push('/search')
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
            <button className="searchBtn" onClick={goToSearch}>
                <p className="navButtonText">People</p>
                <BiSearch size={20} />
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
            <hr />

            <>
                <button
                    className="landfillBtn"
                    onClick={() => props.changeDisplay(2)}
                >
                    <MdLandscape size={40} />
                </button>

                <button
                    className="binBtn"
                    onClick={() => props.changeDisplay(3)}
                >
                    <FaDumpster size={40} />
                </button>
            </>
        </nav>
    )
}

export default Nav
