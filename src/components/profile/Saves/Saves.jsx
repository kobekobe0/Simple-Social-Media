import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import firebase from '@firebase/app-compat'
import PostCard from '../posts/postCard'
import CardContent from '../../home/contents/CardContent'
import { useAuth } from '../../../context/authContext'
import { app } from '../../../firebase'

function Saves(props) {
    const [saves, setSaves] = useState([])
    const { currentUser } = useAuth()
    const [temp, setTemp] = useState(0)
    const [renderSaves, setRenderSaves] = useState([])
    const postRef = db.collection('posts')
    console.log(saves)

    const getSaves = async () => {
        let savePromise = []

        saves.map((save) => {
            savePromise.push(postRef.doc(save).get())
        })

        Promise.all(savePromise).then((docs) => {
            let temp = []
            docs.map((doc) => {
                temp.push(doc.data())
            })
            setRenderSaves(temp)
        })
    }

    const getPfp = async (userId) => {
        const images = app.storage().ref().child(`pfp/${userId}pfp`)
        let url = images.getDownloadURL()
        return url
    }

    console.log(renderSaves)

    useEffect(() => {
        setSaves(props.saves)
    }, [props.saves])

    useEffect(() => {
        getSaves().catch((err) => console.log(err))
    }, [saves])

    return (
        <div className="contents" style={{ width: '70%' }}>
            {renderSaves
                .filter((post) => {
                    return post !== undefined
                })
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
                        documentID={res.documentID}
                        userId={res.userId}
                        postRef={postRef}
                        ifLiked={res.likes.includes(currentUser.uid)}
                        ifSaved={res.saves.includes(currentUser.uid)}
                        reload={setTemp}
                        reloader={temp}
                        reverse={true}
                    />
                ))}
        </div>
    )
}

export default Saves
