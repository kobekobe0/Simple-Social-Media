import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { BiEdit } from 'react-icons/bi'
import Follows from './Follows'
import Followers from './Followers'
import EditProfile from './EditProfile'
import { storagee } from '../../../firebase'
import { useAuth } from '../../../context/authContext'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import firebase from '@firebase/app-compat'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { HiUserRemove, HiUserAdd } from 'react-icons/hi'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { useLocation } from 'react-router'

function Userinfo(props) {
    const { currentUser } = useAuth()
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [followed, setFollowed] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [followerShow, setFollowerShow] = React.useState(false)
    const [followingShow, setFollowingShow] = React.useState(false)
    const [editProfileShow, setEditProfileShow] = React.useState(false)
    const [pfpUpload, setPfpUpload] = useState('')
    const tempStore = storagee
    const location = useLocation()
    const storage = getStorage()

    const follow = async () => {
        const UserID = location.pathname.replace('/visit/', '')
        await db
            .collection('users')
            .doc(currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.arrayUnion(UserID),
            })

        await db
            .collection('users')
            .doc(UserID)
            .update({
                followers: firebase.firestore.FieldValue.arrayUnion(
                    currentUser.uid
                ),
            })
        setTrigger(trigger + 1)
    }
    const unfollow = async () => {
        const UserID = location.pathname.replace('/visit/', '')
        await db
            .collection('users')
            .doc(currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.arrayRemove(UserID),
            })

        await db
            .collection('users')
            .doc(UserID)
            .update({
                followers: firebase.firestore.FieldValue.arrayRemove(
                    currentUser.uid
                ),
            })
        setTrigger(trigger + 1)
    }

    const checkFollow = async () => {
        const UserID = location.pathname.replace('/visit/', '')
        const check = await db.collection('users').doc(UserID).get()

        check.data().followers.includes(currentUser.uid)
            ? setFollowed(true)
            : setFollowed(false)
    }

    useEffect(() => {
        setFollowing(props.following)
        setFollowers(props.followers)
        props.visit ? checkFollow() : console.log('no')
    }, [props.following, trigger])

    return (
        <div className="profileHeader">
            <div className="banner">
                <img
                    src={
                        props.banner == ''
                            ? 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.macmillandictionary.com%2Fus%2Fdictionary%2Famerican%2Fgray_1&psig=AOvVaw1HanXafavshW9qZwMct-0o&ust=1636982079862000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMje9cz3l_QCFQAAAAAdAAAAABAD'
                            : props.banner
                    }
                    alt=""
                    style={{ backgroundColor: 'dimgray' }}
                />
            </div>
            <div className="profileInfo">
                <div className="profileImg">
                    <img src={props.profileImage} alt="" />
                </div>
                <div className="profileStat">
                    <p className="profileUsername">
                        {props.visit ? props.username : currentUser.displayName}
                    </p>
                    <div className="follows">
                        <p onClick={() => setFollowerShow(true)}>
                            <strong>
                                {followers ? followers.length : '1'}
                            </strong>{' '}
                            Followers
                        </p>
                        <p onClick={() => setFollowingShow(true)}>
                            <strong>
                                {following ? following.length : '0'}
                            </strong>{' '}
                            Following
                        </p>
                        <Followers
                            followers={followers}
                            open={followerShow}
                            close={() => setFollowerShow(false)}
                            trigger={trigger}
                            visit={props.visit}
                        />
                        <Follows
                            following={following}
                            open={followingShow}
                            close={() => setFollowingShow(false)}
                            trigger={trigger}
                            visit={props.visit}
                        />
                    </div>
                </div>
                <div className="profileButton">
                    {props.visit ? (
                        followed ? (
                            <button
                                style={{
                                    border: 'none',
                                    backgroundColor: 'white',
                                }}
                                onClick={() => setEditProfileShow(true)}
                                onClick={unfollow}
                            >
                                <HiUserRemove size={40} color="red" />
                            </button>
                        ) : (
                            <button
                                style={{
                                    border: 'none',
                                    backgroundColor: 'white',
                                }}
                                onClick={() => setEditProfileShow(true)}
                                onClick={follow}
                            >
                                <HiUserAdd size={40} color="skyBlue" />
                            </button>
                        )
                    ) : (
                        <button
                            style={{ border: 'none', backgroundColor: 'white' }}
                            onClick={() => setEditProfileShow(true)}
                        >
                            <BiEdit size={40} />
                        </button>
                    )}

                    <EditProfile
                        open={editProfileShow}
                        close={() => setEditProfileShow(false)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Userinfo
