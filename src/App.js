import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/home/Home'
import { AuthProvider } from './context/authContext'
import PrivateRoute from './components/PrivateRoute'
import Profile from './components/profile/Profile'
import TopNav from './components/home/TopNav'
import VisitProfile from './components/VisitProfile/VisitProfile.jsx'
import Search from './components/home/contents/Search'

function App() {
    return (
        <AuthProvider>
            <div>
                <TopNav />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/search" component={Search} />
                    <PrivateRoute
                        path="/visit/:user_id"
                        component={VisitProfile}
                    />
                </Switch>
            </div>
        </AuthProvider>
    )
}

export default App
