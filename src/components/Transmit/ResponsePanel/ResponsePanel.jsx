// src/components/Transmit/ResponsePanel/ResponsePanel.jsx
import React, {useState} from 'react';
import {Card, Nav, Spinner} from 'react-bootstrap';
import ResponseBody from './ResponseBody';
import ResponseHeaders from './ResponseHeaders';
import {useNotification} from '../context/NotificationContext';

const ResponsePanel = ( {
                            response,
                            loading,
                            error,
                            onSave,
                            onClear
                        } ) => {
    const [ activeTab, setActiveTab ] = useState( 'body' );
    const { notify }                  = useNotification();

    if ( loading ) {
        return (
            <Card className="mt-3">
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <div className="mt-2 text-muted">Sending request...</div>
                </Card.Body>
            </Card>
        );
    }

    if ( error ) {
        return (
            <Card className="mt-3 border-danger">
                <Card.Body>
                    <Card.Title className="text-danger">Request Failed</Card.Title>
                    <pre className="bg-light p-3 rounded mt-3" style={{ maxHeight: '300px', overflow: 'auto' }}>
            {error.message}
                        {error.details && (
                            <div className="mt-2 text-muted">
                                {JSON.stringify( error.details, null, 2 )}
                            </div>
                        )}
          </pre>
                </Card.Body>
            </Card>
        );
    }

    if ( !response ) {
        return (
            <Card className="mt-3">
                <Card.Body className="text-center py-5 text-muted">
                    Send a request to see the response
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mt-3" style={{ maxHeight: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
            <Card.Header>
                <Nav variant="tabs" className="card-header-tabs">
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'body'}
                            onClick={() => setActiveTab( 'body' )}
                        >
                            Response Body
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'headers'}
                            onClick={() => setActiveTab( 'headers' )}
                        >
                            Response Headers
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'info'}
                            onClick={() => setActiveTab( 'info' )}
                        >
                            Info
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body className="overflow-auto">
                {activeTab === 'body' && (
                    <ResponseBody
                        data={response.data}
                        contentType={response.headers[ 'content-type' ]}
                        onCopy={() => notify( 'Response copied to clipboard', 'success' )}
                    />
                )}
                {activeTab === 'headers' && (
                    <ResponseHeaders
                        headers={response.headers}
                        onCopy={() => notify( 'Headers copied to clipboard', 'success' )}
                    />
                )}
                {activeTab === 'info' && (
                    <div className="response-info">
                        <div className="mb-3">
                            <h6>Status</h6>
                            <div className={`alert ${response.status < 400 ? 'alert-success' : 'alert-danger'}`}>
                                {response.status} {response.statusText}
                            </div>
                        </div>
                        <div className="mb-3">
                            <h6>Time</h6>
                            <div className="text-muted">{response.time}ms</div>
                        </div>
                        <div className="mb-3">
                            <h6>Size</h6>
                            <div className="text-muted">{( response.size / 1024 ).toFixed( 2 )} KB</div>
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default ResponsePanel;
