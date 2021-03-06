import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { auth } from '../firebase'
import { useHistory } from 'react-router-dom'
import { storagee } from '../firebase'
import { db } from '../firebase'

function Signup() {
    const { signup, setCurrentUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [profileImg, setProfileImg] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const history = useHistory()
    const [imgError, setImgError] = useState(false)
    const [disable, setDisable] = useState(false)
    const [checkPassword, setCheckPassword] = useState(false)
    const [checkEmail, setCheckEmail] = useState(false)
    const tempStore = storagee

    const SignUp = async (e) => {
        e.preventDefault()
        setDisable(true)

        const createDocument = (userId, url) => {
            db.collection('users').doc(userId).set({
                bio: '',
                followers: [],
                following: [],
                savedItems: [],
                likes: [],
                posts: [],
                profileBackground: '',
                profilePicture: url,
                username: username,
                userId: userId,
            })
        }

        const signupTemp = async () => {
            profileImg.type.includes('image')
                ? password == confirmPassword
                    ? auth
                          .createUserWithEmailAndPassword(email, password)
                          .then(async (res) => {
                              const tempStoreRef = tempStore.ref()
                              const fileRef = tempStoreRef.child(
                                  `pfp/${res.user.uid}pfp`
                              )
                              await fileRef.put(profileImg)
                              console.log(profileImg.type)
                              const url = await fileRef.getDownloadURL()

                              try {
                                  createDocument(res.user.uid, url)
                                  res.user.updateProfile({
                                      displayName: username,
                                      photoURL: url,
                                  })
                                  history.push('/login')
                              } catch (err) {
                                  console.log(err)
                              }
                          })
                          .catch((err) => {
                              setCheckEmail(true)
                              setDisable(false)
                          })
                    : setCheckPassword(true) && setDisable(false)
                : setImgError(true)
        }
        signupTemp()
    }

    return (
        <div className="form">
            <card>
                <h1>Signup</h1>
                <form className="sl-form" onSubmit={SignUp}>
                    <input
                        type="email"
                        placeholder="type email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="username"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength="12"
                        minLength="4"
                        required
                    />
                    <input
                        required
                        type="password"
                        placeholder="type password"
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                    />
                    <input
                        required
                        type="password"
                        placeholder="confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <hr />
                    {imgError ? (
                        <p
                            style={{
                                color: 'red',
                                margin: '0',
                                justifySelf: 'center',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                            }}
                        >
                            Please select image file
                        </p>
                    ) : null}
                    {checkPassword ? (
                        <p
                            style={{
                                color: 'red',
                                margin: '0',
                                justifySelf: 'center',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                            }}
                        >
                            Password does not match
                        </p>
                    ) : null}
                    {checkEmail ? (
                        <p
                            style={{
                                color: 'red',
                                margin: '0',
                                justifySelf: 'center',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                            }}
                        >
                            Email is already in use
                        </p>
                    ) : null}
                    <input
                        type="file"
                        onChange={(e) => setProfileImg(e.target.files[0])}
                    />

                    <button id="signup" disabled={disable}>
                        {disable ? 'Signing up...' : 'Signup'}
                    </button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </card>
        </div>
    )
}

export default Signup
