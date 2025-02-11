// src/components/Transmit/ResponsePanel/ResponseBody.jsx
import React, {useState, useEffect} from 'react';
import {ButtonGroup, Button, Form} from 'react-bootstrap';
import {Copy, Download} from 'lucide-react';
import {useNotification} from '../context/NotificationContext';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-markup';

const ResponseBody = ( { data, contentType, onCopy } ) => {
    const [ viewMode, setViewMode ] = useState( 'formatted' );
    const { notify }                = useNotification();

    useEffect( () => {
        Prism.highlightAll();
    }, [ data, viewMode ] );

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

    const getLanguage = () => {
        // Check if data is a JSON object first
        if ( typeof data === 'object' ||
            ( contentType && contentType.includes( 'application/json' ) ) ||
            ( typeof data === 'string' && data.trim().startsWith( '{' ) ) ) {
            return 'json';
        }
        if ( contentType?.includes( 'text/html' ) ) return 'html';
        if ( contentType?.includes( 'text/xml' ) ) return 'xml';
        if ( contentType?.includes( 'javascript' ) ) return 'javascript';
        return 'text';
    };

    const formatContent = ( content ) => {
        if ( typeof content === 'object' ) {
            return JSON.stringify( content, null, viewMode === 'formatted' ? 2 : 0 );
        }
        // Try to parse string as JSON if it looks like JSON
        if ( typeof content === 'string' && content.trim().startsWith( '{' ) ) {
            try {
                const parsed = JSON.parse( content );
                return JSON.stringify( parsed, null, viewMode === 'formatted' ? 2 : 0 );
            } catch ( e ) {
                console.warn( 'Failed to parse JSON string:', e );
            }
        }
        return content;
    };

    const renderContent = () => {
        if ( !data ) return null;

        const containerStyles = {
            position:        'relative',
            maxHeight:       '500px',
            overflow:        'auto',
            backgroundColor: '#2d2d2d',
            borderRadius:    '0.25rem',
        };

        const preStyles = {
            margin:          0,
            padding:         '1rem',
            fontSize:        '0.875rem',
            backgroundColor: 'transparent',
            whiteSpace:      viewMode === 'formatted' ? 'pre-wrap' : 'pre',
            wordWrap:        'break-word',
            wordBreak:       'break-word',
            overflowWrap:    'break-word',
            maxWidth:        '100%',
        };

        const codeStyles = {
            whiteSpace: 'inherit',
            wordBreak:  'inherit',
            fontSize:   'inherit',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        };

        if ( contentType?.includes( 'text/html' ) && viewMode === 'preview' ) {
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

        const language         = getLanguage();
        const formattedContent = formatContent( data );

        console.log( 'Language detected:', language );
        console.log( 'Content type:', contentType );
        console.log( 'Data type:', typeof data );

        return (
            <div style={containerStyles}>
        <pre style={preStyles}>
          <code className={`language-${language}`} style={codeStyles}>
            {formattedContent}
          </code>
        </pre>
            </div>
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
            <div className="flex-grow-1" style={{ minHeight: 0 }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default ResponseBody;
