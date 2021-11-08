import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import firebase from '@firebase/app-compat'
import { db } from '../../../firebase'

function PostModal(props) {
    const postRef = db.collection('posts').doc(props.documentId)
    const [post, setPost] = React.useState(null)

    const getPost = async () => {
        await postRef.get().then((post) => {
            setPost(post.data())
        })
    }
    useEffect(() => {
        getPost()
    }, [props.documentId])

    //fetches the post data from the database

    return <div></div>
}

export default PostModal
