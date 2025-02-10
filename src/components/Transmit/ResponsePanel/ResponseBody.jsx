// src/components/Transmit/ResponsePanel/ResponseBody.jsx
import React, {useState} from 'react';
import {ButtonGroup, Button, Form} from 'react-bootstrap';
import {Copy, Download} from 'lucide-react';
import {useNotification} from '../context/NotificationContext';

const ResponseBody = ( { data, contentType, onCopy } ) => {
    const [ viewMode, setViewMode ] = useState( 'formatted' );
    const { notify }                = useNotification();

    const handleCopy = async () => {
        try {
            const text = typeof data === 'object' ? JSON.stringify( data, null, 2 ) : data;
            await navigator.clipboard.writeText( text );
            onCopy();
        } catch ( error ) {
            notify( 'Failed to copy response', 'error' );
        }
    };

    const handleDownload = () => {
        try {
            const text = typeof data === 'object' ? JSON.stringify( data, null, 2 ) : data;
            const blob = new Blob( [ text ], { type: contentType || 'text/plain' } );
            const url  = URL.createObjectURL( blob );
            const a    = document.createElement( 'a' );
            a.href     = url;
            a.download = 'response.' + ( contentType?.includes( 'json' ) ? 'json' : 'txt' );
            document.body.appendChild( a );
            a.click();
            document.body.removeChild( a );
            URL.revokeObjectURL( url );
            notify( 'Response downloaded successfully', 'success' );
        } catch ( error ) {
            notify( 'Failed to download response', 'error' );
        }
    };

    const renderContent = () => {
        if ( !data ) return null;

        if ( contentType?.includes( 'application/json' ) ) {
            if ( viewMode === 'raw' ) {
                return (
                    <pre className="bg-light p-3 rounded">
            {JSON.stringify( data )}
          </pre>
                );
            }
            return (
                <pre className="bg-light p-3 rounded">
          {JSON.stringify( data, null, 2 )}
        </pre>
            );
        }

        if ( contentType?.includes( 'text/html' ) ) {
            if ( viewMode === 'raw' ) {
                return (
                    <pre className="bg-light p-3 rounded">
            {data}
          </pre>
                );
            }
            return (
                <iframe
                    srcDoc={data}
                    className="w-100"
                    style={{ height: '500px', border: 'none' }}
                    title="Response Preview"
                />
            );
        }

        return (
            <pre className="bg-light p-3 rounded">
        {data}
      </pre>
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Select
                    style={{ width: 'auto' }}
                    value={viewMode}
                    onChange={( e ) => setViewMode( e.target.value )}
                >
                    <option value="formatted">Formatted</option>
                    <option value="raw">Raw</option>
                    {contentType?.includes( 'text/html' ) && <option value="preview">Preview</option>}
                </Form.Select>
                <ButtonGroup>
                    <Button variant="outline-secondary" onClick={handleCopy}>
                        <Copy size={16} className="me-2" />
                        Copy
                    </Button>
                    <Button variant="outline-secondary" onClick={handleDownload}>
                        <Download size={16} className="me-2" />
                        Download
                    </Button>
                </ButtonGroup>
            </div>
            {renderContent()}
        </div>
    );
};

export default ResponseBody;
