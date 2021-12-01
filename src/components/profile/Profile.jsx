import React, { useEffect, useState } from 'react'
import './profile.css'
import { useHistory } from 'react-router-dom'
import Userinfo from './UserInfo/Userinfo'
import { db } from '../../firebase'
import { useAuth } from '../../context/authContext'
import ProfileNav from './profileNav/ProfileNav'
import { Switch, Route } from 'react-router-dom'
import Posts from './posts/Posts'
import Likes from './Likes/Likes'
import Saves from './Saves/Saves'
import PrivateRoute from '../PrivateRoute'

function Profile() {
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
    const { currentUser } = useAuth()

    const getUserInfo = async () => {
        let userTemp = {}
        await db
            .collection('users')
            .doc(currentUser.uid)
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

    useEffect(() => {
        getUserInfo()
    }, [])
    return (
        <div className="profile">
            <div className="profileWrapper">
                <Userinfo
                    banner={banner}
                    profileImage={profilePicture}
                    username={username}
                    followers={followers}
                    following={following}
                />
                <ProfileNav />
                <hr className="hrProfile" />

                <PrivateRoute path="/profile/likes">
                    <Likes likes={likes} />
                </PrivateRoute>

                <PrivateRoute path="/profile/saves">
                    <Saves saves={saves} />
                </PrivateRoute>

                <PrivateRoute exact path="/profile">
                    <Posts posts={posts} />
                </PrivateRoute>
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

export default Profile
