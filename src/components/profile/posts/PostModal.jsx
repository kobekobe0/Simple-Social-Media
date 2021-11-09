import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import firebase from '@firebase/app-compat'
import { db } from '../../../firebase'
import reactDom from 'react-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
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

const MODAL_INFO_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '1rem',
    padding: '1rem',
}

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

    console.log(post)

    if (!props.open) return null
    return reactDom.createPortal(
        <>
            <div style={OVERLAY_STYLE} />
            <div style={MODAL_STYLE}>
                <button onClick={props.close}>close</button>
                <img src={post.imgUrl} alt="" style={{ width: '100%' }} />
                <div className="postModalInfo" style={MODAL_INFO_STYLE}>
                    <div
                        className="modalLike"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {post.likes.includes(
                            firebase.auth().currentUser.uid
                        ) ? (
                            <AiFillHeart
                                size="1.5em"
                                style={{
                                    color: 'red',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    postRef
                                        .update({
                                            likes: firebase.firestore.FieldValue.arrayRemove(
                                                firebase.auth().currentUser.uid
                                            ),
                                        })
                                        .then(() => {
                                            getPost()
                                        })
                                }}
                            />
                        ) : (
                            <AiOutlineHeart
                                size="1.5em"
                                style={{
                                    color: 'black',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    postRef
                                        .update({
                                            likes: firebase.firestore.FieldValue.arrayUnion(
                                                firebase.auth().currentUser.uid
                                            ),
                                        })
                                        .then(() => {
                                            getPost()
                                        })
                                }}
                            />
                        )}
                        <p style={{ margin: '0' }}>{post.likes.length}</p>
                    </div>

                    <div className="modalSave">
                        {post.saves.includes(
                            firebase.auth().currentUser.uid
                        ) ? (
                            <BsFillBookmarkFill
                                size="1.5em"
                                style={{
                                    color: 'black',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    postRef
                                        .update({
                                            saves: firebase.firestore.FieldValue.arrayRemove(
                                                firebase.auth().currentUser.uid
                                            ),
                                        })
                                        .then(() => {
                                            getPost()
                                        })
                                }}
                            />
                        ) : (
                            <BsBookmark
                                size="1.5em"
                                style={{
                                    color: 'black',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    postRef
                                        .update({
                                            saves: firebase.firestore.FieldValue.arrayUnion(
                                                firebase.auth().currentUser.uid
                                            ),
                                        })
                                        .then(() => {
                                            getPost()
                                        })
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default PostModal
