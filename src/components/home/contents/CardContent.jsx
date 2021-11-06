import React, { useState } from 'react'
import './card.css'
import { AiFillLike } from 'react-icons/ai'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BiCommentDots } from 'react-icons/bi'
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'
import { useAuth } from '../../../context/authContext'
import firebase from '@firebase/app-compat'
import Popoverr from './Popover'
import PostModal from './PostModal'
import { db } from '../../../firebase'

function CardContent(props) {
    const { currentUser } = useAuth()
    const [toggleLike, setToggleLike] = useState(props.ifLiked)
    const [toggleSave, setToggleSave] = useState(props.ifSaved)
    const [likes, setLikes] = useState(props.likes)
    //const [comments, setComments] = useState(props.comments)
    const [addComments, setAddComments] = useState('')
    const [temp, setTemp] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    const like = async (docuId) => {
        const addLikeRef = await props.postRef.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                likes: firebase.firestore.FieldValue.arrayUnion(docuId),
            })
        setToggleLike(!toggleLike)
        setLikes(likes + 1)
    }

    const unlike = async (docuId) => {
        const addLikeRef = await props.postRef.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
        })
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                likes: firebase.firestore.FieldValue.arrayRemove(docuId),
            })
        setToggleLike(!toggleLike)
        console.log(toggleLike)
        setLikes(likes - 1)
    }

    const addComment = async (docuId) => {
        const addCommentRef = await props.postRef.doc(docuId)

        const addComment = addCommentRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })
        setModalShow(false)
    }

    const deletePost = async (docuId) => {
        const res = await props.postRef.doc(docuId).delete()
        props.reload(props.reloader + 1)
    }

    const saveToBookmark = async (docuId) => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                savedItems: firebase.firestore.FieldValue.arrayUnion(docuId),
            })

        const addLikeRef = await props.postRef.doc(docuId)

        addLikeRef.update({
            saves: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })
        setToggleSave(!toggleSave)
    }

    const unSaveToBookmark = async (docuId) => {
        db.collection('users')
            .doc(currentUser.uid)
            .update({
                savedItems: firebase.firestore.FieldValue.arrayRemove(docuId),
            })

        const addLikeRef = await props.postRef.doc(docuId)

        addLikeRef.update({
            saves: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
        })
        setToggleSave(!toggleSave)
    }

    return (
        <div className="card-component">
            <div className="card-header">
                <div className="card-header-image_edit">
                    <div className="card-image_username">
                        <img
                            src={props.userProfilePicture}
                            className="user-profile-picture"
                        />
                        <p>{props.userName}</p>
                    </div>

                    <Popoverr
                        postedImage={props.postedImage}
                        userId={props.userId}
                        deletePost={() => deletePost(props.documentID)}
                    />
                </div>
            </div>

            <div>
                <img
                    src={props.postedImage}
                    alt="postedImage"
                    className="posted-image"
                />
            </div>
            <div className="descriptionWrapper">
                <p className="description">{props.description}</p>
            </div>
            <div className="postFooter">
                <div className="likes">
                    {!toggleLike ? (
                        <button
                            style={{ border: 'none', backgroundColor: 'snow' }}
                            onClick={
                                (props.likes + 1, () => like(props.documentID))
                            }
                        >
                            <AiOutlineHeart size={30} />
                        </button>
                    ) : (
                        <button
                            onClick={() => unlike(props.documentID)}
                            style={{ border: 'none', backgroundColor: 'snow' }}
                        >
                            <AiFillHeart
                                size={30}
                                style={{ color: 'tomato' }}
                            />
                        </button>
                    )}

                    <p className="likeCounter">{likes}</p>
                </div>

                <div className="comments">
                    {toggleSave ? (
                        <button
                            style={{
                                border: 'none',
                                backgroundColor: 'snow',
                                marginLeft: '2rem',
                            }}
                            onClick={() => unSaveToBookmark(props.documentID)}
                        >
                            <BsFillBookmarkFill size={25} />
                        </button>
                    ) : (
                        <button
                            style={{
                                border: 'none',
                                backgroundColor: 'snow',
                                marginLeft: '2rem',
                            }}
                            onClick={() => saveToBookmark(props.documentID)}
                        >
                            <BsBookmark size={25} />
                        </button>
                    )}
                </div>
                <PostModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    postedImage={props.postedImage}
                />
            </div>
        </div>
    )
}

export default CardContent
