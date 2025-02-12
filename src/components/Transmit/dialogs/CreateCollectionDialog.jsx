// src/components/Transmit/dialogs/CreateCollectionDialog.jsx

import React, {useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import {Folder} from 'lucide-react';

const CreateCollectionDialog = ( { show, onHide, onSave } ) => {
    const [ name, setName ]               = useState( '' );
    const [ description, setDescription ] = useState( '' );

    const handleSubmit = ( e ) => {
        e.preventDefault();
        if ( !name.trim() ) return;

        onSave( {
            name:        name.trim(),
            description: description.trim()
        } );

        // Clear form and close dialog
        setName( '' );
        setDescription( '' );
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            onExited={() => {
                setName( '' );
                setDescription( '' );
            }}
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center">
                        <Folder className="me-2" size={20} />
                        Create Collection
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter collection name"
                            value={name}
                            onChange={( e ) => setName( e.target.value )}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter collection description"
                            value={description}
                            onChange={( e ) => setDescription( e.target.value )}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={ !name.trim()}
                    >
                        Create Collection
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateCollectionDialog;
