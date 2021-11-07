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
    const tempStore = storagee

    const SignUp = async (e) => {
        e.preventDefault()

        const tempStoreRef = tempStore.ref()
        const fileRef = tempStoreRef.child(profileImg.name)
        await fileRef.put(profileImg)
        console.log(profileImg.type)
        const url = await fileRef.getDownloadURL()
        const userRef = db.collection('users')

        const createDocument = (userId) => {
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
            })
        }

        profileImg.type.includes('image')
            ? password == confirmPassword && username
                ? auth
                      .createUserWithEmailAndPassword(email, password)
                      .then((res) => {
                          try {
                              createDocument(res.user.uid)
                              res.user.updateProfile({
                                  displayName: username,
                                  photoURL: url,
                              })
                              //this is where you should make the doc in users collection
                              console.log(res)

                              //---------------------------------------------------------
                              history.push('/login')
                          } catch (err) {
                              console.log(err)
                          }
                      })
                : console.log('checkpass')
            : setImgError(true)
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
                        required
                    />
                    <input
                        required
                        type="password"
                        placeholder="type password"
                        onChange={(e) => setPassword(e.target.value)}
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
                    <input
                        type="file"
                        onChange={(e) => setProfileImg(e.target.files[0])}
                    />

                    <button id="signup">Signup</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </card>
        </div>
    )
}

export default Signup
