import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import CardContent from './CardContent'
import { db, app, storagee } from '../../../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../../context/authContext'
import firebase from '@firebase/app-compat'

function Content() {
    const { currentUser } = useAuth()
    const storage = getStorage()
    const tempStore = storagee
    const postRef = db.collection('posts')
    const userRef = db.collection('users')
    const displayPostRef = db.collection('posts').orderBy('dateCreated', 'desc')
    const [upload, setUpload] = useState('')
    const [contents, setContents] = useState([])
    const [fileUrl, setFileUrl] = useState('')
    const [description, setDescription] = useState('')
    const [temp, setTemp] = useState(0)
    const [documentID, setDocumentID] = useState([])
    //const storageRef = app.storage().ref()

    const handleUpload = (e) => {
        if (e.target.files[0]) {
            setUpload(e.target.files[0])
        }
    }

    const createDocument = async (imgurl) => {
        const pushPost = await userRef.doc(currentUser.uid)
        postRef
            .add({
                dateCreated: firebase.firestore.Timestamp.now().toDate(),
                description: description,
                imgUrl: imgurl,
                likes: [],
                comments: [],
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userPicture: currentUser.photoURL,
                valueToUseForPuttingItOnTop: contents.length + 1,
                saves: [],
            })
            .then((res) => {
                pushPost.update({
                    posts: firebase.firestore.FieldValue.arrayUnion(res.id),
                })
            })
    }

    const handlePost = async () => {
        const tempStoreRef = tempStore.ref()
        const fileRef = tempStoreRef.child(upload.name)
        await fileRef.put(upload)
        const url = await fileRef.getDownloadURL()

        createDocument(url)

        setUpload('')
        setDescription('')
        setTemp(temp + 1)
    }

    const getData = async () => {
        const snapshot = await displayPostRef.get()
        const contentsToSet = []

        snapshot.forEach((doc) =>
            contentsToSet.push({
                documentId: doc.id,
                ...doc.data(),
            })
        )

        setContents(contentsToSet)
    }

    console.log(contents)

    useEffect(() => {
        setContents([])
        getData()
        console.log('reload')
        console.log(firebase.firestore.Timestamp.now().toDate())
    }, [temp])

    return (
        <main className="contents">
            <div className="post-card">
                <input
                    type="text"
                    placeholder="say something..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input type="file" onChange={handleUpload} />
                <button onClick={handlePost}>Post</button>
            </div>
            {contents.map((res) => (
                <CardContent
                    userProfilePicture={res.userPicture}
                    description={res.description}
                    postedImage={res.imgUrl}
                    likes={res.likes.length}
                    userName={res.userName}
                    documentID={res.documentId}
                    userId={res.userId}
                    postRef={postRef}
                    ifLiked={res.likes.includes(currentUser.uid)}
                    ifSaved={res.saves.includes(currentUser.uid)}
                    reload={setTemp}
                    reloader={temp}
                    comments={res.comments.length}
                />
            ))}
        </main>
    )
}

export default Content
