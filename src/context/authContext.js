import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [visit, setVisit] = useState('')
    const history = useHistory()

    const logout = () => {
        return auth
            .signOut()
            .then(() => setCurrentUser(false))
            .then(() => history.push('/login'))
    }
    console.log(currentUser)
    const signup = (email, password) => {
        return auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                try {
                    setCurrentUser(response.user)
                    history.push('/login')
                    return response.user
                } catch {
                    console.log('error signup')
                }
            })
    }
    const login = (email, password) => {
        return auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                try {
                    setCurrentUser(response.user)
                    history.push('/')
                    return response.user
                } catch {
                    console.log('error login')
                }
            })
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    if (loading) {
        return <>Loading....</>
    }

    const value = {
        currentUser,
        logout,
        login,
        signup,
        setCurrentUser,
        visit,
        setVisit,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
