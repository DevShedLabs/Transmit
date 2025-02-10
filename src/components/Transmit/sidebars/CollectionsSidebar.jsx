// src/components/Transmit/sidebars/CollectionsSidebar.jsx
import React from 'react';
import {FolderPlus, ChevronDown, History} from 'lucide-react';

const CollectionsSidebar = ( {
                                 collections = [], // Add default value
                                 onSelect = () => {
                                 },
                                 onShowHistory = () => {
                                 },
                                 onCreateCollection = () => {
                                 }
                             } ) => {
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Collections</h2>
                    <button
                        onClick={onCreateCollection}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        <FolderPlus className="w-4 h-4" />
                    </button>
                </div>

                {collections.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-4">
                        No collections yet
                    </div>
                ) : (
                     collections.map( collection => (
                         <CollectionGroup
                             key={collection.id}
                             collection={collection}
                             onSelect={onSelect}
                         />
                     ) )
                 )}
            </div>

            <button
                onClick={onShowHistory}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 mt-auto"
            >
                <History className="w-4 h-4" />
                History
            </button>
        </div>
    );
};

const CollectionGroup = ( { collection, onSelect } ) => {
    const [ isOpen, setIsOpen ] = React.useState( true );

    return (
        <div className="mb-2">
            <div
                className="flex items-center gap-1 hover:bg-gray-700 p-1 rounded cursor-pointer"
                onClick={() => setIsOpen( !isOpen )}
            >
                <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                        isOpen ? '' : '-rotate-90'
                    }`}
                />
                <span>{collection.name}</span>
            </div>

            {isOpen && (
                <div className="ml-4">
                    {collection.items.map( item => (
                        <RequestItem
                            key={item.id}
                            item={item}
                            onClick={() => onSelect( item )}
                        />
                    ) )}
                </div>
            )}
        </div>
    );
};

const RequestItem = ( { item, onClick } ) => {
    const methodColors = {
        GET:    'text-green-400',
        POST:   'text-blue-400',
        PUT:    'text-yellow-400',
        DELETE: 'text-red-400'
    };

    return (
        <div
            className="flex items-center gap-2 hover:bg-gray-700 p-1 rounded cursor-pointer text-sm"
            onClick={onClick}
        >
            <div className={`w-12 text-xs ${methodColors[ item.method ] || 'text-gray-400'}`}>
                {item.method}
            </div>
            <span>{item.name}</span>
        </div>
    );
};

export default CollectionsSidebar;
