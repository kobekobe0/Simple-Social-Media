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
    const [error, setError] = useState(false)
    const history = useHistory()

    const Login = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
                setCurrentUser(res.user)
                history.push('/')

                console.log('error login')
            })
            .catch((e) => setError(true))
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
                    <p style={{ fontSize: '10px' }}>
                        <Link to="/reset">forgot password?</Link>
                    </p>
                    {error ? (
                        <p style={{ color: 'red' }}>wrong credentials</p>
                    ) : null}
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
