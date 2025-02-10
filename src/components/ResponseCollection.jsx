// src/components/Transmit/components/ResponseCollection.jsx
import React, {useState} from 'react';
import {Card, Nav, Badge, Button, ButtonGroup} from 'react-bootstrap';
import {Copy, Download, Share} from 'lucide-react';
import {useNotification} from '../context/NotificationContext';

export const ResponseCollection = ( { response, onSave } ) => {
    const [ activeTab, setActiveTab ] = useState( 'body' );
    const { notify }                  = useNotification();

    if ( !response ) return null;

    const handleCopy = async ( content, type ) => {
        try {
            const text = typeof content === 'object' ? JSON.stringify( content, null, 2 ) : content;
            await navigator.clipboard.writeText( text );
            notify( `${type} copied to clipboard`, 'success' );
        } catch ( error ) {
            notify( 'Failed to copy to clipboard', 'error' );
        }
    };

    const handleDownload = ( content, filename ) => {
        try {
            const blob = new Blob( [ JSON.stringify( content, null, 2 ) ], { type: 'application/json' } );
            const url  = URL.createObjectURL( blob );
            const a    = document.createElement( 'a' );
            a.href     = url;
            a.download = filename;
            document.body.appendChild( a );
            a.click();
            document.body.removeChild( a );
            URL.revokeObjectURL( url );
            notify( 'Response downloaded successfully', 'success' );
        } catch ( error ) {
            notify( 'Failed to download response', 'error' );
        }
    };

    const renderStatusBadge = () => {
        const variant = response.status < 400 ? 'success' : 'danger';
        return (
            <Badge bg={variant}>
                {response.status} {response.statusText}
            </Badge>
        );
    };

    const renderHeaders = () => (
        <div className="mt-3">
            {Object.entries( response.headers ).map( ( [ key, value ] ) => (
                <div key={key} className="mb-2">
                    <strong className="text-muted">{key}:</strong> {value}
                </div>
            ) )}
        </div>
    );

    const renderBody = () => {
        const contentType = response.headers[ 'content-type' ];
        if ( contentType?.includes( 'application/json' ) ) {
            return (
                <pre className="bg-light p-3 rounded">
          {JSON.stringify( response.data, null, 2 )}
        </pre>
            );
        }
        if ( contentType?.includes( 'text/html' ) ) {
            return (
                <iframe
                    srcDoc={response.data}
                    className="w-100"
                    style={{ height: '400px', border: 'none' }}
                    title="Response Preview"
                />
            );
        }
        return (
            <pre className="bg-light p-3 rounded">
        {response.data}
      </pre>
        );
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        {renderStatusBadge()}
                        <small className="text-muted">
                            {response.time}ms • {( response.size / 1024 ).toFixed( 2 )}KB
                        </small>
                    </div>
                    <ButtonGroup>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleCopy( response.data, 'Response' )}
                        >
                            <Copy size={16} />
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleDownload( response, 'response.json' )}
                        >
                            <Download size={16} />
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={onSave}
                        >
                            <Share size={16} />
                        </Button>
                    </ButtonGroup>
                </div>
            </Card.Header>
            <Card.Body>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'body'}
                            onClick={() => setActiveTab( 'body' )}
                        >
                            Body
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'headers'}
                            onClick={() => setActiveTab( 'headers' )}
                        >
                            Headers
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {activeTab === 'body' ? renderBody() : renderHeaders()}
            </Card.Body>
        </Card>
    );
};