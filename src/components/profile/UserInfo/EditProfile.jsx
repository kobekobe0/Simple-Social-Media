import React from 'react'
import { useState, useEffect } from 'react'
import reactDom from 'react-dom'
import { db } from '../../../firebase'
import { AiOutlineClose } from 'react-icons/ai'
import { storagee } from '../../../firebase'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { useAuth } from '../../../context/authContext'
import { getAuth, updateProfile, updatePassword } from 'firebase/auth'

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    height: '50vh',
    width: '400px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    maxWidth: '90vw',
}

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: '9998',
}

const HEADER_STYLE = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '1rem',
    alignItems: 'center',
}

const BODY_STYLE = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexStart',
    padding: '1rem',

    height: '100%',
    overflowY: 'scroll',
}

const LIST_STYLE = {
    display: 'flex',
    padding: '1rem',
}

function EditProfile(props) {
    const [pfpUpload, setPfpUpload] = useState('')
    const [bgUpload, setBgUpload] = useState('')
    const [updatedUsername, setUpdatedUsername] = useState('')
    const [updatedPassword, setUpdatedPassword] = useState('')
    const [disable, setDisable] = useState(false)
    const { currentUser } = useAuth()
    const auth = getAuth()
    const tempStore = storagee
    const storage = getStorage()
    const userRef = db.collection('users').doc(currentUser.uid)

    const updatePfp = async () => {
        const pfpRef = ref(storage, `pfp/${currentUser.uid}pfp`)
        deleteObject(pfpRef)

        const addNewPfp = async () => {
            const tempStoreRef = tempStore.ref()
            const fileRef = tempStoreRef.child(`pfp/${currentUser.uid}pfp`)
            await fileRef.put(pfpUpload)
        }
        await addNewPfp()
    }
    const updateBg = async () => {
        const fileRef = tempStore.ref().child(`bg/${currentUser.uid}bg`)
        await fileRef.put(bgUpload)
        const url = await fileRef.getDownloadURL()
        const res = await userRef.update({ profileBackground: url })
    }

    const updateUsernameFunc = async () => {
        updateProfile(auth.currentUser, {
            displayName: updatedUsername,
        })

        const res = await userRef.update({ username: updatedUsername })
    }

    const updatePasswordFunc = async () => {
        updatePassword(auth.currentUser, updatedPassword)
    }

    const updateUser = async () => {
        setDisable(true)
        Promise.all([
            pfpUpload !== '' ? updatePfp() : console.log('no pfp'),

            updatedUsername !== ''
                ? updateUsernameFunc()
                : console.log('no username'),

            updatedPassword !== ''
                ? updatePasswordFunc()
                : console.log('no password'),

            bgUpload !== '' ? updateBg() : console.log('no bg'),
        ]).then(() => {
            window.location.reload()
        })
    }

    if (!props.open) return null
    return reactDom.createPortal(
        <>
            <div style={OVERLAY_STYLE} />

            <div style={MODAL_STYLE}>
                <div style={HEADER_STYLE}>
                    <div></div>
                    <p style={{ padding: '0', margin: '0' }}>Edit Profile</p>

                    <AiOutlineClose
                        onClick={props.close}
                        style={{ cursor: 'pointer', color: 'tomato' }}
                        size={15}
                    />
                </div>
                <hr style={{ margin: '0' }} />
                <div style={BODY_STYLE}>
                    <form onSubmit={updateUser}>
                        <img src={pfpUpload} alt="" />
                        <input
                            type="file"
                            onChange={(e) => setPfpUpload(e.target.files[0])}
                        />
                        <input
                            type="file"
                            onChange={(e) => setBgUpload(e.target.files[0])}
                        />

                        <input
                            type="username"
                            maxLength="12"
                            minLength="4"
                            onChange={(e) => setUpdatedUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            maxLength="12"
                            minLength="4"
                            onChange={(e) => setUpdatedPassword(e.target.value)}
                        />
                    </form>
                    <button disabled={disable} onClick={updateUser}>
                        update
                    </button>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default EditProfile
