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

function CardContent(props) {
    const { currentUser } = useAuth()
    const [toggleLike, setToggleLike] = useState(props.ifLiked)
    const [likes, setLikes] = useState(props.likes)
    const [comments, setComments] = useState(props.comments)
    const [addComments, setAddComments] = useState('')
    const [temp, setTemp] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    const like = async (docuId) => {
        const addLikeRef = await props.postRef.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        })

        setToggleLike(!toggleLike)
        setLikes(likes + 1)
    }

    const unlike = async (docuId) => {
        const addLikeRef = await props.postRef.doc(docuId)

        const addLike = addLikeRef.update({
            likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
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
                    {toggleLike ? (
                        <button
                            onClick={() => unlike(props.documentID)}
                            style={{ border: 'none', backgroundColor: 'snow' }}
                        >
                            <AiFillHeart
                                size={30}
                                style={{ color: 'tomato' }}
                            />
                        </button>
                    ) : (
                        <button
                            style={{ border: 'none', backgroundColor: 'snow' }}
                            onClick={
                                (props.likes + 1, () => like(props.documentID))
                            }
                        >
                            <AiOutlineHeart size={30} />
                        </button>
                    )}

                    <p className="likeCounter">{likes}</p>
                </div>

                <div className="comments">
                    <button
                        style={{
                            border: 'none',
                            backgroundColor: 'snow',
                            marginLeft: '2rem',
                        }}
                        onClick={() => setModalShow(true)}
                    >
                        <BsBookmark size={25} />
                    </button>
                    <p>{comments}</p>
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
