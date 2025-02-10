// src/components/Transmit/ResponsePanel/ResponseHeaders.jsx
import React from 'react';
import {Button} from 'react-bootstrap';
import {Copy} from 'lucide-react';
import {useNotification} from '../context/NotificationContext';

const ResponseHeaders = ( { headers, onCopy } ) => {
    const { notify } = useNotification();

    const handleCopy = async () => {
        try {
            const text = Object.entries( headers )
                .map( ( [ key, value ] ) => `${key}: ${value}` )
                .join( '\n' );
            await navigator.clipboard.writeText( text );
            onCopy();
        } catch ( error ) {
            notify( 'Failed to copy headers', 'error' );
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="outline-secondary" onClick={handleCopy}>
                    <Copy size={16} className="me-2" />
                    Copy Headers
                </Button>
            </div>
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>Header</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries( headers ).map( ( [ key, value ] ) => (
                        <tr key={key}>
                            <td className="text-muted" style={{ width: '30%' }}>{key}</td>
                            <td>{value}</td>
                        </tr>
                    ) )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResponseHeaders;

