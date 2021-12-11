import React, { useEffect, useState } from 'react'
import './card.css'
import { AiFillLike } from 'react-icons/ai'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BiCommentDots } from 'react-icons/bi'
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs'
import { useAuth } from '../../../context/authContext'
import firebase from '@firebase/app-compat'
import Popoverr from './Popover'
import { Link, useLocation } from 'react-router-dom'
import { db } from '../../../firebase'

function CardContent(props) {
    const { currentUser, setVisit } = useAuth()
    const [toggleLike, setToggleLike] = useState(props.ifLiked)
    const [toggleSave, setToggleSave] = useState(props.ifSaved)
    const [likes, setLikes] = useState(props.likes)
    const [pfp, setPfp] = useState('')
    //const [comments, setComments] = useState(props.comments)
    const [addComments, setAddComments] = useState('')
    const [temp, setTemp] = useState(false)
    const [reverse, setReverse] = useState(props.reverse)
    const userRef = db.collection('users')
    const location = useLocation()

    const VisitProfile = (user) => {
        setVisit(user)
    }

    useEffect(() => {
        const pfpTemp = props.userProfilePicture(props.userId)
        Promise.all([pfpTemp]).then((values) => {
            setPfp(values[0])
        })
        console.log(pfpTemp)
    }, [props.userId])

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
        setToggleLike(!toggleLike)
        setLikes(likes + 1)
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
        setToggleLike(!toggleLike)
        console.log(toggleLike)
        setLikes(likes - 1)
    }

    const deletePost = async (docuId, postReference) => {
        const res = await postReference.doc(docuId).delete()
        props.reload(props.reloader + 1)

        const userPostRef = await userRef.doc(currentUser.uid)
        userPostRef.update({
            posts: firebase.firestore.FieldValue.arrayRemove(docuId),
        })
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
        setToggleSave(!toggleSave)
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
        setToggleSave(!toggleSave)
    }

    return (
        <div className="card-component">
            <div className="card-header">
                <div className="card-header-image_edit">
                    <div className="card-image_username">
                        {location.pathname.includes('/profile') ? (
                            <>
                                <img
                                    src={pfp}
                                    className="user-profile-picture"
                                />
                                <p>{props.userName}</p>
                            </>
                        ) : (
                            <Link
                                onClick={() => VisitProfile(props.userId)}
                                to={`visit/${props.userId}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={pfp}
                                    className="user-profile-picture"
                                />
                                <p style={{ margin: '0' }}>{props.userName}</p>
                            </Link>
                        )}
                    </div>

                    <Popoverr
                        postedImage={props.postedImage}
                        userId={props.userId}
                        deletePost={() =>
                            deletePost(props.documentID, props.postRef)
                        }
                    />
                </div>
            </div>

            <div>
                {props.postedImage == '' ? null : (
                    <img
                        src={props.postedImage}
                        alt="postedImage"
                        className="posted-image"
                    />
                )}
            </div>
            {props.description == '' ? null : (
                <div className="descriptionWrapper">
                    <p
                        className="description"
                        style={{ wordBreak: 'break-word' }}
                    >
                        {props.description}
                    </p>
                </div>
            )}

            <div
                className="postFooter"
                style={{
                    paddingTop: props.description == '' ? '1rem' : '0rem',
                }}
            >
                <div className="likes">
                    {!toggleLike ? (
                        <button
                            style={{ border: 'none', backgroundColor: 'snow' }}
                            onClick={
                                (props.likes + 1,
                                () => like(props.documentID, props.postRef))
                            }
                        >
                            <AiOutlineHeart size={30} />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                unlike(props.documentID, props.postRef)
                            }
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
                            onClick={() =>
                                unSaveToBookmark(
                                    props.documentID,
                                    props.postRef
                                )
                            }
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
                            onClick={() =>
                                saveToBookmark(props.documentID, props.postRef)
                            }
                        >
                            <BsBookmark size={25} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CardContent
