import React from 'react'
import { Modal, Button } from 'react-bootstrap'

function PostModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            dialogClassName="modal-90w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Comment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" style={{ width: '100%', padding: '1rem' }} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PostModal
