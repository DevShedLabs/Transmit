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
                .map( ( [ key, value ] ) => {
                    const displayValue = typeof value === 'object' ? JSON.stringify( value, null, 2 ) : value;
                    return `${key}: ${displayValue}`;
                } )
                .join( '\n' );
            await navigator.clipboard.writeText( text );
            onCopy();
        } catch ( error ) {
            notify( 'Failed to copy headers', 'error' );
        }
    };

    const formatHeaderValue = ( value ) => {
        if ( typeof value === 'object' ) {
            return JSON.stringify( value, null, 2 );
        }
        return value;
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
                            <td>
                                    <pre style={{
                                        margin:     0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak:  'break-word',
                                        background: 'none',
                                        border:     'none',
                                        padding:    0,
                                        fontSize:   'inherit',
                                        fontFamily: 'inherit'
                                    }}>
                                        {formatHeaderValue( value )}
                                    </pre>
                            </td>
                        </tr>
                    ) )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResponseHeaders;