// src/components/Transmit/sidebars/CollectionsSidebar.jsx

import React, {useState} from 'react';
import {Button, Nav, Dropdown} from 'react-bootstrap';
import {FolderPlus, ChevronDown, History, MoreVertical, Folder, Edit, Trash2} from 'lucide-react';
import CreateCollectionDialog from '../dialogs/CreateCollectionDialog';

const CollectionsSidebar = ( {
                                 collections = [],
                                 onSelect,
                                 onShowHistory,
                                 onCreateCollection,
                                 onDeleteCollection,
                                 onDeleteRequest
                             } ) => {
    const [ showCreateDialog, setShowCreateDialog ] = useState( false );

    return (
        <div className="d-flex flex-column h-100">
            <CreateCollectionDialog
                show={showCreateDialog}
                onHide={() => setShowCreateDialog( false )}
                onSave={onCreateCollection}
            />

            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Collections</h5>
                    <Button
                        variant="link"
                        className="p-0 text-white"
                        onClick={() => setShowCreateDialog( true )}
                    >
                        <FolderPlus size={18} />
                    </Button>
                </div>

                {collections.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        <Folder size={32} className="mb-2 opacity-50" />
                        <div>No collections yet</div>
                        <Button
                            variant="link"
                            className="text-primary mt-2"
                            onClick={() => setShowCreateDialog( true )}
                        >
                            Create your first collection
                        </Button>
                    </div>
                ) : (
                     <Nav className="flex-column">
                         {collections.map( collection => (
                             <CollectionGroup
                                 key={collection.id}
                                 collection={collection}
                                 onSelect={onSelect}
                                 onDelete={onDeleteCollection}
                                 onDeleteRequest={onDeleteRequest}
                             />
                         ) )}
                     </Nav>
                 )}
            </div>

            <Button
                variant="link"
                className="text-white mt-auto mx-3 mb-3 text-decoration-none"
                onClick={onShowHistory}
            >
                <History size={18} className="me-2" />
                History
            </Button>
        </div>
    );
};

const CollectionGroup = ( { collection, onSelect, onDelete, onDeleteRequest } ) => {
    const [ isOpen, setIsOpen ] = useState( true );

    const handleDelete = ( e ) => {
        e.stopPropagation();
        if ( window.confirm( `Are you sure you want to delete the collection "${collection.name}"?` ) ) {
            onDelete( collection.id );
        }
    };

    return (
        <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between text-white p-2">
                <Button
                    variant="link"
                    className="text-white p-0 text-decoration-none flex-grow-1 text-start"
                    onClick={() => setIsOpen( !isOpen )}
                >
                    <ChevronDown
                        size={18}
                        className={`me-2 ${isOpen ? '' : 'rotate-270'}`}
                        style={{ transition: 'transform 0.2s' }}
                    />
                    {collection.name}
                </Button>
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-white p-0">
                        <MoreVertical size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <Edit size={14} className="me-2" /> Rename
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleDelete} className="text-danger">
                            <Trash2 size={14} className="me-2" /> Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {isOpen && (
                <Nav className="flex-column ms-3">
                    {collection.requests.map( request => (
                        <RequestItem
                            key={request.id}
                            item={request}
                            onClick={() => onSelect( request )}
                            onDelete={() => onDeleteRequest( collection.id, request.id )}
                        />
                    ) )}
                </Nav>
            )}
        </div>
    );
};

const RequestItem = ( { item, onClick, onDelete } ) => {
    const methodColors = {
        GET:    'text-success',
        POST:   'text-primary',
        PUT:    'text-warning',
        DELETE: 'text-danger'
    };

    const handleDelete = ( e ) => {
        e.stopPropagation();
        if ( window.confirm( `Are you sure you want to delete "${item.name}"?` ) ) {
            onDelete();
        }
    };

    return (
        <div className="d-flex align-items-center group">
            <Button
                variant="link"
                className="text-white p-2 text-decoration-none flex-grow-1 text-start"
                onClick={onClick}
            >
                <span className={`me-2 ${methodColors[ item.method ] || 'text-muted'}`} style={{ fontSize: '0.8em' }}>
                    {item.method}
                </span>
                <span>{item.name}</span>
            </Button>
            <Button
                variant="link"
                className="text-danger p-1 opacity-0 group-hover:opacity-100"
                onClick={handleDelete}
            >
                <Trash2 size={14} />
            </Button>
        </div>
    );
};

export default CollectionsSidebar;
