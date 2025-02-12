// src/components/Transmit/sidebars/HistorySidebar.jsx

import React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {Button, ListGroup} from 'react-bootstrap';
import {Trash2, RotateCcw} from 'lucide-react';
import {useStorage} from '../hooks/useStorage';
import {useNotification} from '../context/NotificationContext';

const HistorySidebar = ( { history = [], onSelect } ) => {
    const { clearHistory } = useStorage();
    const { notify }       = useNotification();

    const handleClearHistory = () => {
        if ( window.confirm( 'Are you sure you want to clear all history?' ) ) {
            clearHistory();
            notify( 'History cleared', 'success' );
        }
    };

    const getStatusColor = ( status ) => {
        if ( status >= 200 && status < 300 ) return 'text-success';
        if ( status >= 300 && status < 400 ) return 'text-info';
        if ( status >= 400 && status < 500 ) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="p-3 border-bottom bg-light">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">History</h5>
                    <div>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => window.location.reload()}
                        >
                            <RotateCcw size={16} />
                        </Button>
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleClearHistory}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto">
                {history.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        No history yet
                    </div>
                ) : (
                     <ListGroup variant="flush">
                         {history.map( ( item ) => (
                             <ListGroup.Item
                                 key={item.id}
                                 action
                                 onClick={() => onSelect( item )}
                                 className="border-bottom"
                             >
                                 <div className="d-flex justify-content-between align-items-start">
                                     <div>
                                         <div className="d-flex align-items-center">
                                             <span className={`me-2 badge ${
                                                 item.request.method === 'GET' ? 'bg-success' :
                                                 item.request.method === 'POST' ? 'bg-primary' :
                                                 item.request.method === 'PUT' ? 'bg-warning' :
                                                 item.request.method === 'DELETE' ? 'bg-danger' :
                                                 'bg-secondary'
                                             }`}>
                                                 {item.request.method}
                                             </span>
                                             <span className="text-truncate" style={{ maxWidth: '200px' }}>
                                                 {item.request.url}
                                             </span>
                                         </div>
                                         <small className="text-muted d-block mt-1">
                                             {formatDistanceToNow( new Date( item.timestamp ), { addSuffix: true } )}
                                         </small>
                                     </div>
                                     <span className={`ms-2 ${getStatusColor( item.response.status )}`}>
                                         {item.response.status}
                                     </span>
                                 </div>
                             </ListGroup.Item>
                         ) )}
                     </ListGroup>
                 )}
            </div>
        </div>
    );
};

export default HistorySidebar;
