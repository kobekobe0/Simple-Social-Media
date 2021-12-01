import React, { useState, useRef } from 'react'
import { Overlay, Popover, Button } from 'react-bootstrap'
import { BsThreeDots } from 'react-icons/bs'
import { useAuth } from '../../../context/authContext'
function Popoverr(props) {
    const { currentUser } = useAuth()
    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const ref = useRef(null)

    const handleClick = (event) => {
        setShow(!show)
        setTarget(event.target)
    }

    return (
        <div ref={ref}>
            <Button
                variant="light"
                style={{
                    backgroundColor: 'unset',
                    borderColor: 'rgba(0,0,0,0)',
                }}
                onClick={handleClick}
            >
                <BsThreeDots />
            </Button>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref}
                containerPadding={20}
            >
                <Popover id="popover-contained">
                    {props.userId == currentUser.uid ? (
                        <Popover.Body
                            onClick={props.deletePost}
                            style={{ cursor: 'pointer', color: 'red' }}
                        >
                            Delete
                        </Popover.Body>
                    ) : null}
                    <Popover.Body
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        <a href={props.postedImage} target="_blank">
                            Save
                        </a>
                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    )
}

export default Popoverr
