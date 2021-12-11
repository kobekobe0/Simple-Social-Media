import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import firebase from '@firebase/app-compat'
import { db } from '../../../firebase'
import reactDom from 'react-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import { useAuth } from '../../../context/authContext'
import Popoverr from '../../home/contents/Popover'
import { Link } from 'react-router-dom'

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    maxHeight: '90vh',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
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
    padding: '0.5rem',
}

const HEADER_STYLE = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '0.5rem',
    alignItems: 'center',
    margin: '0',
}

const DESCRIPTION_STYLE = {
    marginLeft: '2rem',
    marginRight: '1.5rem',
    marginTop: '0',
    marginTop: '0',
}
const P_STYLE = {
    margin: '0',
    wordBreak: 'break-word',
}

function PostModal(props) {
    const { currentUser } = useAuth()
    const postReff = db.collection('posts').doc(props.documentId)
    const postRef = db.collection('posts')
    const userRef = db.collection('users')
    const [post, setPost] = React.useState({})
    const [likes, setLikes] = React.useState([])

    const getPost = async () => {
        await postReff.get().then((post) => {
            setPost(post.data())
        })
    }

    const like = async (docuId, postReference) => {
        const addLikeRef = await postReference.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(docuId),
            })

        getPost()
    }

    const unlike = async (docuId, postReference) => {
        const addLikeRef = await postReference.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
        })
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(docuId),
            })

        getPost()
    }

    const deletePost = async (docuId, postReference) => {
        const res = await postReference.doc(docuId).delete()

        const userPostRef = await userRef.doc(currentUser.uid)
        userPostRef.update({
            posts: firebase.firestore.FieldValue.arrayRemove(docuId),
        })

        window.location.reload()
    }

    const saveToBookmark = async (docuId, postReference) => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                savedItems: firebase.firestore.FieldValue.arrayUnion(docuId),
            })

        const addLikeRef = await postReference.doc(docuId)

        addLikeRef.update({
            saves: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })
        getPost()
    }

    const unSaveToBookmark = async (docuId, postReference) => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                savedItems: firebase.firestore.FieldValue.arrayRemove(docuId),
            })

        const addLikeRef = await postReference.doc(docuId)

        addLikeRef.update({
            saves: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
        })
        getPost()
    }

    useEffect(() => {
        getPost()
    }, [props.documentId])
    useEffect(() => {
        let likesTemp = []
        setLikes(post.likes)
    }, [post])

    console.log(post)

    if (!props.open) return null
    return reactDom.createPortal(
        <>
            <div style={OVERLAY_STYLE} />
            <div style={MODAL_STYLE}>
                <div style={HEADER_STYLE}>
                    <img
                        src={post.userPicture}
                        style={{
                            width: '25px',
                            height: '25px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                        }}
                    />

                    <p style={{ margin: '0' }}>{post.userName}</p>
                    <div
                        style={{
                            display: 'flex',
                            margin: '0',
                            alignItems: 'center',
                        }}
                    >
                        <Popoverr
                            postedImage={post.imgUrl}
                            userId={post.userId}
                            backgroundColor={true}
                            deletePost={() =>
                                deletePost(post.documentID, postRef)
                            }
                        />
                        <AiOutlineClose
                            onClick={props.close}
                            size={25}
                            className="modalCloseBtn"
                        />
                    </div>
                </div>

                <img
                    src={post.imgUrl}
                    alt=""
                    style={{
                        width: 'auto',
                        maxHeight: '60vh',
                        objectFit: 'cover',
                    }}
                />

                <div style={DESCRIPTION_STYLE}>
                    <p style={P_STYLE}>{post.description}</p>
                </div>

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
                                onClick={() => unlike(post.documentID, postRef)}
                            />
                        ) : (
                            <AiOutlineHeart
                                size="1.5em"
                                style={{
                                    color: 'black',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => like(post.documentID, postRef)}
                            />
                        )}
                        <p style={{ margin: '0' }}>
                            {likes !== null ? likes.length : '0'}
                        </p>
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
                                onClick={() =>
                                    unSaveToBookmark(post.documentID, postRef)
                                }
                            />
                        ) : (
                            <BsBookmark
                                size="1.5em"
                                style={{
                                    color: 'black',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    saveToBookmark(post.documentID, postRef)
                                }
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
