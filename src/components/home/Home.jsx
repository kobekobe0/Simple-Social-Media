import React, { useState } from 'react'
import Nav from './nav/Nav'
import Content from './contents/Content'
import Preview from './preview/Preview'
import Message from '../message/Message'
import Profile from '../profile/Profile'
import TopNav from './TopNav'
function Home() {
    const [render, setRender] = useState(2)
    return (
        <div className="home">
            <div className="wrapper">
                {render == 2 ? <Content /> : null}
                {render == 1 ? <Message /> : null}
                <Nav changeDisplay={setRender} />
            </div>
        </div>
    )
}

export default Home
