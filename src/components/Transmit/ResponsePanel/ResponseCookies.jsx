// src/components/Transmit/ResponsePanel/ResponseCookies.jsx

import React from 'react';
import {Button} from 'react-bootstrap';
import {Copy} from 'lucide-react';
import {useNotification} from '../context/NotificationContext';

const ResponseCookies = ( { cookies = [], onCopy } ) => {
    const { notify } = useNotification();

    const handleCopy = async () => {
        try {
            const text = cookies.map( cookie => {
                const mainPair   = `${cookie.name}=${cookie.value}`;
                const attributes = Object.entries( cookie )
                    .filter( ( [ key ] ) => ![ 'name', 'value' ].includes( key ) )
                    .map( ( [ key, value ] ) => {
                        if ( value === true ) return key;
                        return `${key}=${value}`;
                    } )
                    .join( '; ' );
                return `${mainPair}${attributes ? '; ' + attributes : ''}`;
            } ).join( '\n' );

            await navigator.clipboard.writeText( text );
            onCopy();
        } catch ( error ) {
            notify( 'Failed to copy cookies', 'error' );
        }
    };

    if ( !cookies || cookies.length === 0 ) {
        return (
            <div className="text-muted text-center py-3">
                No cookies in response
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="outline-secondary" onClick={handleCopy}>
                    <Copy size={16} className="me-2" />
                    Copy Cookies
                </Button>
            </div>
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Attributes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cookies.map( ( cookie, index ) => (
                        <tr key={index}>
                            <td style={{ width: '20%' }}>
                                {cookie.name}
                            </td>
                            <td style={{ width: '30%' }}>
                                <div className="text-break">{cookie.value}</div>
                            </td>
                            <td>
                                {Object.entries( cookie )
                                    .filter( ( [ key ] ) => ![ 'name', 'value' ].includes( key ) )
                                    .map( ( [ key, value ], i ) => (
                                        <div key={key} className="mb-1">
                                            <span className="text-muted">{key}</span>:
                                            <span className="ms-1">
                                                {value === true ? '[Flag]' : value}
                                            </span>
                                        </div>
                                    ) )
                                }
                            </td>
                        </tr>
                    ) )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResponseCookies;