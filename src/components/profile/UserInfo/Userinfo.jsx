import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { BiEdit } from 'react-icons/bi'
import Follows from './Follows'
import Followers from './Followers'

function Userinfo(props) {
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [followerShow, setFollowerShow] = React.useState(false)
    const [followingShow, setFollowingShow] = React.useState(false)

    console.log(following)

    useEffect(() => {
        setFollowing(props.following)
        setFollowers(props.followers)
    }, [props.following])

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
                    <p className="profileUsername">{props.username}</p>
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
                        />
                        <Follows
                            following={following}
                            open={followingShow}
                            close={() => setFollowingShow(false)}
                        />
                    </div>
                </div>
                <div className="profileButton">
                    <button
                        style={{ border: 'none', backgroundColor: 'white' }}
                    >
                        <BiEdit size={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Userinfo
