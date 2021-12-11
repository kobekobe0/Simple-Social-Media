import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { db } from '../../firebase'
import { useAuth } from '../../context/authContext'
import '../profile/profile.css'
import { useLocation } from 'react-router'
import Posts from '../profile/posts/Posts'
import PrivateRoute from '../PrivateRoute'
import Userinfo from '../profile/UserInfo/Userinfo'
import Profile from '../profile/Profile'

function VisitProfile(props) {
    const history = useHistory()
    const [userInfo, setUserInfo] = useState('')
    const [bio, setBio] = useState('')
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [likes, setLikes] = useState([])
    const [posts, setPosts] = useState([])
    const [banner, setBanner] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [saves, setSaves] = useState([])
    const [username, setUsername] = useState('')
    const { currentUser, visit } = useAuth()
    const location = useLocation()
    const UserID = location.pathname.replace('/visit/', '') //removes vist params in url to extract the uid

    const getUserInfo = async () => {
        let userTemp = {}
        await db
            .collection('users')
            .doc(UserID)
            .get()
            .then((res) => {
                userTemp = res.data()
            })
            .catch((err) => console.log(err))

        setBio(userTemp.bio)
        setFollowers(userTemp.followers)
        setFollowing(userTemp.following)
        setLikes(userTemp.likes)
        setPosts(userTemp.posts)
        setBanner(userTemp.profileBackground)
        setProfilePicture(userTemp.profilePicture)
        setProfilePicture(userTemp.profilePicture)
        setSaves(userTemp.savedItems)
        setUsername(userTemp.username)
    }

    console.log(UserID)
    useEffect(() => {
        getUserInfo()
    }, [location.pathname])
    if (UserID === currentUser.uid) {
        history.push('/profile')
        return <Profile />
    }

    return (
        <div className="profile">
            <div className="profileWrapper">
                <Userinfo
                    banner={banner}
                    profileImage={profilePicture}
                    username={username}
                    followers={followers}
                    following={following}
                    visit={true}
                />
                <Posts posts={posts} visit={true} />

                <div
                    style={{
                        height: '100px',
                        width: '100vw',
                        backgroundColor: 'lighttomato',
                        marginTop: '3rem',
                    }}
                ></div>
            </div>
        </div>
    )
}

export default VisitProfile
