import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import firebase from '@firebase/app-compat'
import PostCard from './postCard'

function Posts(props) {
    const [posts, setPosts] = useState([])
    const [renderPost, setRenderPost] = useState([])
    const postRef = db.collection('posts')

    const getPosts = async () => {
        let usersPromise = []

        posts.map((id) => {
            usersPromise.push(postRef.doc(id).get())
        })

        Promise.all(usersPromise).then((docs) => {
            const posts = docs.map((doc) => doc.data())

            // do your operations with users list
            setRenderPost(posts)
        })
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

    console.log(renderPost)
    return (
        <div
            className="postBlock"
            style={{ marginTop: props.visit ? '2rem' : 'unset' }}
        >
            <div className="postWrapper">
                {renderPost != []
                    ? renderPost
                          .sort((a, b) => {
                              return a.dateCreated > b.dateCreated ? -1 : 1
                          })
                          .map((post) => (
                              <PostCard
                                  img={post.imgUrl}
                                  documentId={post.documentID}
                                  likes={post.likes}
                                  reload={getPosts}
                              />
                          ))
                    : null}
            </div>
        </div>
    )
}

export default Posts
