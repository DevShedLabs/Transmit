// src/components/Transmit/dialogs/SaveRequestDialog.jsx
import React, {useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import {Save, Plus, ArrowLeft} from 'lucide-react';

const SaveRequestDialog = ( { show, onHide, onSave, collections, onCreateCollection } ) => {
    const [ selectedCollection, setSelectedCollection ]       = useState( '' );
    const [ requestName, setRequestName ]                     = useState( '' );
    const [ requestDescription, setRequestDescription ]       = useState( '' );
    // State for collection creation
    const [ isCreatingCollection, setIsCreatingCollection ]   = useState( false );
    const [ collectionName, setCollectionName ]               = useState( '' );
    const [ collectionDescription, setCollectionDescription ] = useState( '' );

    const resetForm = () => {
        setSelectedCollection( '' );
        setRequestName( '' );
        setRequestDescription( '' );
        setCollectionName( '' );
        setCollectionDescription( '' );
        setIsCreatingCollection( false );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();

        if ( isCreatingCollection ) {
            // Create new collection and wait for it to complete
            await onCreateCollection( {
                name:        collectionName.trim(),
                description: collectionDescription.trim()
            } );

            // Return to save request form
            setIsCreatingCollection( false );
            setCollectionName( '' );
            setCollectionDescription( '' );

            // Don't close the dialog - let user continue saving the request
            return;
        }

        // Save the request
        onSave( {
            collectionId: selectedCollection,
            request:      {
                name:        requestName.trim(),
                description: requestDescription.trim()
            }
        } );
        resetForm();
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            onExited={resetForm}
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center">
                        {isCreatingCollection ? <Plus size={20} className="me-2" /> :
                         <Save size={20} className="me-2" />}
                        {isCreatingCollection ? 'Create Collection' : 'Save Request'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isCreatingCollection ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Collection Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter collection name"
                                    value={collectionName}
                                    onChange={( e ) => setCollectionName( e.target.value )}
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
                                    value={collectionDescription}
                                    onChange={( e ) => setCollectionDescription( e.target.value )}
                                />
                            </Form.Group>
                            <Button
                                variant="link"
                                className="px-0 mb-3"
                                onClick={() => setIsCreatingCollection( false )}
                            >
                                <ArrowLeft size={16} className="me-1" />
                                Back to Save Request
                            </Button>
                        </>
                    ) : (
                         <>
                             <Form.Group className="mb-3">
                                 <Form.Label>Collection</Form.Label>
                                 <div className="d-flex gap-2">
                                     <Form.Select
                                         value={selectedCollection}
                                         onChange={( e ) => setSelectedCollection( e.target.value )}
                                         required
                                     >
                                         <option value="">Select a collection</option>
                                         {collections.map( collection => (
                                             <option key={collection.id} value={collection.id}>
                                                 {collection.name}
                                             </option>
                                         ) )}
                                     </Form.Select>
                                     <Button
                                         variant="outline-secondary"
                                         onClick={() => setIsCreatingCollection( true )}
                                         title="Create new collection"
                                         type="button"
                                     >
                                         <Plus size={16} />
                                     </Button>
                                 </div>
                             </Form.Group>
                             <Form.Group className="mb-3">
                                 <Form.Label>Request Name</Form.Label>
                                 <Form.Control
                                     type="text"
                                     placeholder="Enter request name"
                                     value={requestName}
                                     onChange={( e ) => setRequestName( e.target.value )}
                                     required
                                 />
                             </Form.Group>
                             <Form.Group className="mb-3">
                                 <Form.Label>Description</Form.Label>
                                 <Form.Control
                                     as="textarea"
                                     rows={2}
                                     placeholder="Enter request description"
                                     value={requestDescription}
                                     onChange={( e ) => setRequestDescription( e.target.value )}
                                 />
                             </Form.Group>
                         </>
                     )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isCreatingCollection
                                  ? !collectionName.trim()
                                  : !selectedCollection || !requestName.trim()
                        }
                    >
                        {isCreatingCollection ? 'Create Collection' : 'Save Request'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SaveRequestDialog;
