import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import { auth } from '../firebase'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { RiDeleteBin7Line } from 'react-icons/ri'

function Forgot() {
    const { signup, setCurrentUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()
    const aauth = getAuth()

    const reset = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(aauth, email)
            .then(() => {
                history.push('/check-email')
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                console.log(errorCode, errorMessage)
            })
    }

    return (
        <div className="form">
            <card>
                <h1>Reset</h1>
                <form className="sl-form" onSubmit={reset}>
                    <input
                        type="text"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button id="reset">Submit</button>
                </form>
            </card>
        </div>
    )
}

export default Forgot
