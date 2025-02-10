import React from 'react';
import {Button, Nav} from 'react-bootstrap';
import {FolderPlus, ChevronDown, History} from 'lucide-react';

const CollectionsSidebar = ( {
                                 collections = [],
                                 onSelect = () => {
                                 },
                                 onShowHistory = () => {
                                 },
                                 onCreateCollection = () => {
                                 }
                             } ) => {
    return (
        <div className="d-flex flex-column h-100">
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Collections</h5>
                    <Button
                        variant="link"
                        className="p-0 text-white"
                        onClick={onCreateCollection}
                    >
                        <FolderPlus size={18} />
                    </Button>
                </div>

                {collections.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        No collections yet
                    </div>
                ) : (
                     <Nav className="flex-column">
                         {collections.map( collection => (
                             <CollectionGroup
                                 key={collection.id}
                                 collection={collection}
                                 onSelect={onSelect}
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

const CollectionGroup = ( { collection, onSelect } ) => {
    const [ isOpen, setIsOpen ] = React.useState( true );

    return (
        <div className="mb-2">
            <Button
                variant="link"
                className="text-white p-2 text-decoration-none w-100 text-start"
                onClick={() => setIsOpen( !isOpen )}
            >
                <ChevronDown
                    size={18}
                    className={`me-2 ${isOpen ? '' : 'rotate-270'}`}
                    style={{ transition: 'transform 0.2s' }}
                />
                {collection.name}
            </Button>

            {isOpen && (
                <Nav className="flex-column ms-3">
                    {collection.items.map( item => (
                        <RequestItem
                            key={item.id}
                            item={item}
                            onClick={() => onSelect( item )}
                        />
                    ) )}
                </Nav>
            )}
        </div>
    );
};

const RequestItem = ( { item, onClick } ) => {
    const methodColors = {
        GET:    'text-success',
        POST:   'text-primary',
        PUT:    'text-warning',
        DELETE: 'text-danger'
    };

    return (
        <Button
            variant="link"
            className="text-white p-2 text-decoration-none w-100 text-start"
            onClick={onClick}
        >
            <span className={`me-2 ${methodColors[ item.method ] || 'text-muted'}`} style={{ fontSize: '0.8em' }}>
                {item.method}
            </span>
            <span>{item.name}</span>
        </Button>
    );
};

export default CollectionsSidebar;
