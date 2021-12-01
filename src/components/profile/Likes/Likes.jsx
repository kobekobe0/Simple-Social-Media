import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import firebase from '@firebase/app-compat'
import PostCard from '../posts/postCard'
import CardContent from '../../home/contents/CardContent'
import { useAuth } from '../../../context/authContext'

function Likes(props) {
    const [likes, setLikes] = useState([])
    const { currentUser } = useAuth()
    const [temp, setTemp] = useState(0)
    const [renderLikes, setRenderLikes] = useState([])
    const postRef = db.collection('posts')
    console.log(likes)

    const getLikes = async () => {
        let likePromise = []

        likes.map((like) => {
            likePromise.push(postRef.doc(like).get())
        })

        Promise.all(likePromise).then((docs) => {
            let temp = []
            docs.map((doc) => {
                temp.push(doc.data())
            })
            setRenderLikes(temp)
        })
    }

    console.log(renderLikes)

    useEffect(() => {
        setLikes(props.likes)
    }, [props.likes])

    useEffect(() => {
        getLikes().catch((err) => console.log(err))
    }, [likes])

    return (
        <div className="contents" style={{ width: '70%' }}>
            {renderLikes
                .filter((post) => {
                    return post !== undefined
                })
                .sort((a, b) => {
                    return a.dateCreated > b.dateCreated ? -1 : 1
                })
                .map((res) =>
                    res.userPicture != null ? (
                        <CardContent
                            userProfilePicture={res.userPicture}
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
                    ) : null
                )}
        </div>
    )
}

export default Likes
