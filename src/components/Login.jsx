import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import { auth } from '../firebase'
import { RiDeleteBin7Line } from 'react-icons/ri'

function Login() {
    const { signup, setCurrentUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const Login = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
                setCurrentUser(res.user)
                history.push('/')

                console.log('error login')
            })
            .catch((e) => console.log(e))
    }

    return (
        <div className="form">
            <card>
                <h1>Login</h1>
                <form className="sl-form" onSubmit={Login}>
                    <input
                        type="text"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button id="login">Login</button>
                </form>
                <p>
                    Dont have an account? <Link to="/signup">Create one.</Link>
                </p>
            </card>
        </div>
    )
}

export default Login
