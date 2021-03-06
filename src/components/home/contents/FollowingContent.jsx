import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import CardContent from './CardContent'
import { db, app, storagee } from '../../../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../../context/authContext'
import firebase from '@firebase/app-compat'
import Compressor from 'compressorjs'

function FollowingContent() {
    const { currentUser } = useAuth()
    const storage = getStorage()
    const tempStore = storagee
    const postRef = db.collection('posts')
    const userRef = db.collection('users')

    const [upload, setUpload] = useState('')
    const [contents, setContents] = useState([])
    const [fileUrl, setFileUrl] = useState('')
    const [description, setDescription] = useState('')
    const [temp, setTemp] = useState(0)
    const [documentID, setDocumentID] = useState([])
    const [lastLink, setLastLink] = useState({})
    const [snapshott, setSnapshott] = useState('')
    const [following, setFollowing] = useState([])

    const queryFollowings = async () => {
        const following = await userRef.doc(currentUser.uid).get()
        const followingArray = following.data().following
        setFollowing(followingArray)
        console.log(followingArray)
    }

    const handleUpload = (e) => {
        const image = e.target.files[0]
        new Compressor(image, {
            quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
                // compressedResult has the compressed file.
                // Use the compressed file to upload the images to your server.
                setUpload(compressedResult)
                console.log(compressedResult)
            },
        })
    }

    const createDocument = async (imgurl) => {
        const pushPost = await userRef.doc(currentUser.uid)
        const addDocumentID = await postRef
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
                documentID: '',
            })
            .then((res) => {
                pushPost.update({
                    posts: firebase.firestore.FieldValue.arrayUnion(res.id),
                })
                addDocumentID.doc(res.id).update({
                    documentID: res.id,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handlePost = async () => {
        const tempStoreRef = tempStore.ref()
        const fileRef = tempStoreRef.child(
            `posts/${upload.name}SEPARATOR${currentUser.uid}`
        )
        await fileRef.put(upload)
        const url = await fileRef.getDownloadURL()

        upload !== ''
            ? createDocument(url) && setTemp(temp + 1)
            : alert('Please upload an image')

        setUpload('')
        setDescription('')
    }

    const getData = async () => {
        let temps = []

        await Promise.all(
            following.map(
                async (following) =>
                    await postRef
                        .where('userId', '==', following)
                        .limit(4)
                        .get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                temps.push(doc.data())
                                console.log(temps)
                            })
                        })
            )
        )

        Promise.resolve(setContents(temps))
    }

    useEffect(() => {
        getData()
    }, [following])

    useEffect(() => {
        queryFollowings()
    }, [])

    const getPfp = async (userId) => {
        const images = app.storage().ref().child(`pfp/${userId}pfp`)
        let url = images.getDownloadURL()
        return url
    }

    return (
        <main className="contents">
            <div className="post-card">
                <input
                    type="text"
                    placeholder="say something..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input type="file" accept="image/" onChange={handleUpload} />
                <button onClick={handlePost}>Post</button>
            </div>
            {contents
                .sort((a, b) => {
                    return a.dateCreated > b.dateCreated ? -1 : 1
                })
                .map((res) => (
                    <CardContent
                        userProfilePicture={getPfp}
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

export default FollowingContent
