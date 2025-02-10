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

        const preStyles = {
            backgroundColor: '#f8f9fa',
            padding:         '1rem',
            borderRadius:    '0.25rem',
            fontSize:        '0.875rem',
            maxHeight:       '500px',
            overflowX:       'auto',
            overflowY:       'auto',
            whiteSpace:      'pre-wrap',
            wordBreak:       'break-word'
        };

        if ( contentType?.includes( 'application/json' ) ) {
            if ( viewMode === 'raw' ) {
                return (
                    <pre style={preStyles}>
            {JSON.stringify( data )}
          </pre>
                );
            }
            return (
                <pre style={preStyles}>
          {JSON.stringify( data, null, 2 )}
        </pre>
            );
        }

        if ( contentType?.includes( 'text/html' ) ) {
            if ( viewMode === 'raw' ) {
                return (
                    <pre style={preStyles}>
            {data}
          </pre>
                );
            }
            return (
                <iframe
                    srcDoc={data}
                    style={{
                        width:        '100%',
                        height:       '500px',
                        border:       'none',
                        borderRadius: '0.25rem'
                    }}
                    title="Response Preview"
                />
            );
        }

        return (
            <pre style={preStyles}>
        {data}
      </pre>
        );
    };

    return (
        <div className="d-flex flex-column h-100">
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
            <div className="flex-grow-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResponseBody;
