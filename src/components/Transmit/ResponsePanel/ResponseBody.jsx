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

    const renderTableView = () => {
        if ( !Array.isArray( data ) ) return null;
        if ( data.length === 0 ) return null;

        const columns = Object.keys( data[ 0 ] );

        return (
            <div className="table-container" style={{
                maxHeight:    '500px',
                overflowY:    'auto',
                overflowX:    'auto',
                border:       '1px solid #dee2e6',
                borderRadius: '4px'
            }}>
                <table className="table table-striped table-hover" style={{ margin: 0 }}>
                    <thead>
                    <tr>
                        <th>#</th>
                        {columns.map( column => (
                            <th key={column}>{column}</th>
                        ) )}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map( ( row, index ) => (
                        <tr key={index}>
                            <td>{index}</td>
                            {columns.map( column => (
                                <td key={column}>
                                    {typeof row[ column ] === 'object'
                                     ? JSON.stringify( row[ column ] )
                                     : String( row[ column ] )}
                                </td>
                            ) )}
                        </tr>
                    ) )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderContent = () => {
        if ( !data ) return null;

        // For table view
        if ( Array.isArray( data ) && viewMode === 'table' ) {
            return renderTableView();
        }

        // For code view (both formatted and raw)
        const language         = getLanguage();
        const formattedContent = formatContent( data );

        return (
            <div className="code-container" style={{
                backgroundColor: '#2d2d2d',
                borderRadius:    '4px',
                position:        'relative',
                height:          '500px'
            }}>
                <div style={{
                    position: 'absolute',
                    top:      0,
                    left:     0,
                    right:    0,
                    bottom:   0,
                    overflow: 'auto'
                }}>
                    <pre style={{
                        margin:   0,
                        padding:  '1rem',
                        minWidth: 'fit-content'
                    }}>
                        <code className={`language-${language}`} style={{
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            fontSize:   '0.875rem',
                            whiteSpace: 'pre'
                        }}>
                            {formattedContent}
                        </code>
                    </pre>
                </div>
            </div>
        );
    };

    const getLanguage = () => {
        if ( typeof data === 'object' ||
            ( contentType && contentType.includes( 'application/json' ) ) ||
            ( typeof data === 'string' && data.trim().startsWith( '{' ) ) ) {
            return 'json';
        }
        if ( contentType?.includes( 'text/xml' ) ) return 'xml';
        if ( contentType?.includes( 'javascript' ) ) return 'javascript';
        return 'text';
    };

    const formatContent = ( content ) => {
        if ( typeof content === 'object' ) {
            return JSON.stringify( content, null, viewMode === 'formatted' ? 2 : 0 );
        }
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
                    {Array.isArray( data ) && <option value="table">Table</option>}
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
