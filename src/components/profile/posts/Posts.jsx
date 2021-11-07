import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import firebase from '@firebase/app-compat'

function Posts(props) {
    const [posts, setPosts] = useState([])
    const [renderPost, setRenderPost] = useState([])
    const postRef = db.collection('posts')

    const getPosts = async () => {
        const postsTemp = []

        if (posts) {
            await postRef
                .where(firebase.firestore.FieldPath.documentId(), 'in', posts)
                .get()
                .then((res) => {
                    let docs = res.docs
                    for (let doc of docs) {
                        postsTemp.push({
                            ...doc.data(),
                        })
                    }
                })
                .catch((err) => console.log(err))
        }

        setRenderPost(postsTemp)
    }

    //i set parameters for when to make re render in this useState
    //function because setting the posts initial value returns
    //undefined
    useEffect(() => {
        setPosts(props.posts)
    }, [props.posts])

    useEffect(() => {
        getPosts().catch((err) => console.log(err))
    }, [posts])

    return (
        <div>
            POSTS
            {posts.map((post) => (
                <p>{post}</p>
            ))}
            {renderPost
                .sort((a, b) => {
                    return a.valueToUseForPuttingItOnTop >
                        b.valueToUseForPuttingItOnTop
                        ? 1
                        : -1
                })
                .map((post) => (
                    <p>{post.description}</p>
                ))}
            <button onClick={getPosts}>get</button>
        </div>
    )
}

export default Posts
