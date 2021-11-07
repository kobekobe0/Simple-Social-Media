import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

function ProfileNav() {
    let { path, url } = useRouteMatch()
    return (
        <div className="profileNav">
            <Link exact to="/profile" className="profileLinks">
                Posts
            </Link>

            <Link exact to={`${url}/likes`} className="profileLinks">
                Likes
            </Link>

            <Link exact to={`${url}/saves`} className="profileLinks">
                Saves
            </Link>
        </div>
    )
}

export default ProfileNav
