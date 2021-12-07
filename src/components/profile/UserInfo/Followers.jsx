import React from 'react'
import { useState, useEffect } from 'react'
import reactDom from 'react-dom'
import { db } from '../../../firebase'
import { AiOutlineClose } from 'react-icons/ai'

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    height: '50vh',
    width: '400px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    maxWidth: '90vw',
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

const HEADER_STYLE = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: '1rem',
    alignItems: 'center',
}

const BODY_STYLE = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flexStart',
    padding: '1rem',

    height: '100%',
    overflowY: 'scroll',
}

const LIST_STYLE = {
    display: 'flex',
    padding: '1rem',
}

function Followers(props) {
    const [following, setFollowing] = useState([])
    const [renderFollowing, setRenderFollowing] = useState([])
    const userRef = db.collection('users')

    const getFollowing = async () => {
        let followingPromise = []

        following.map((followingOne) => {
            followingPromise.push(userRef.doc(followingOne).get())
        })

        Promise.all(followingPromise).then((docs) => {
            let temp = []
            docs.map((doc) => {
                temp.push(doc.data())
            })
            setRenderFollowing(temp)
        })
    }

    useEffect(() => {
        setFollowing(props.followers)
        console.log(props.followers)
    }, [props.followers])

    useEffect(() => {
        getFollowing().catch((err) => console.log(err))
    }, [following])

    if (!props.open) return null
    return reactDom.createPortal(
        <>
            <div style={OVERLAY_STYLE} />

            <div style={MODAL_STYLE}>
                <div style={HEADER_STYLE}>
                    <div></div>
                    <p style={{ padding: '0', margin: '0' }}>Followers</p>

                    <AiOutlineClose
                        onClick={props.close}
                        style={{ cursor: 'pointer', color: 'tomato' }}
                        size={15}
                    />
                </div>
                <hr style={{ margin: '0' }} />
                <div style={BODY_STYLE}>
                    {renderFollowing != null
                        ? renderFollowing.map((res) => (
                              <div style={LIST_STYLE}>
                                  <img
                                      src={res.profilePicture}
                                      style={{
                                          width: '50px',
                                          height: '50px',
                                          marginRight: '1rem',
                                      }}
                                  />
                                  <p>{res.username}</p>
                              </div>
                          ))
                        : null}
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default Followers
