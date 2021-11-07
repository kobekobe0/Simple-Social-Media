import React, { useState } from 'react'
import { db } from '../../../firebase'
import { BiEdit } from 'react-icons/bi'

function Userinfo(props) {
    const [followers, setFollowers] = useState(props.followers)
    const [following, setFollowing] = useState(props.following)
    return (
        <div className="profileHeader">
            <div className="banner">
                <img src={props.banner} alt="" />
            </div>
            <div className="profileInfo">
                <div className="profileImg">
                    <img src={props.profileImage} alt="" />
                </div>

                <div className="profileStat">
                    <p className="profileUsername">{props.username}</p>
                    <div className="follows">
                        <p>
                            <strong>
                                {followers ? followers.length : '0'}
                            </strong>{' '}
                            Followers
                        </p>
                        <p>
                            <strong>
                                {following ? following.length : '0'}
                            </strong>{' '}
                            Following
                        </p>
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
