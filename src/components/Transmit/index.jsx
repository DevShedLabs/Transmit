// src/components/Transmit/index.jsx
import React, {useCallback} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useTransmitState} from './hooks/useTransmitState';
import {useRequest} from './hooks/useRequest';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import CollectionsSidebar from './sidebars/CollectionsSidebar';
import HistorySidebar from './sidebars/HistorySidebar';
import SettingsDialog from './dialogs/SettingsDialog';
import {useNotification} from './context/NotificationContext';

const Transmit = () => {
    const state                                     = useTransmitState();
    const { sendRequest, loading, error, response } = useRequest();
    const { notify }                                = useNotification();

    const handleSend = useCallback( async () => {
        try {
            if ( !state.url ) {
                notify( 'Please enter a URL', 'error' );
                return;
            }

            // Build request object from state
            const request = {
                method:     state.method,
                url:        state.url,
                headers:    state.headers.filter( h => h.key && h.value ),
                params:     state.params.filter( p => p.key && p.value ),
                body:       state.body,
                bodyType:   state.bodyType,
                bodyFormat: state.bodyFormat,
                auth:       state.auth,
                settings:   state.settings
            };

            const responseData = await sendRequest( request, state.environment );
            state.setResponse( responseData );
            notify( 'Request sent successfully', 'success' );
        } catch ( err ) {
            notify( err.message || 'Failed to send request', 'error' );
        }
    }, [ state, sendRequest, notify ] );

    const handleSave = useCallback( () => {
        notify( 'Saving requests is not implemented yet', 'info' );
    }, [ notify ] );

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col xs={2} className="bg-dark text-white h-100 border-end">
                    <CollectionsSidebar
                        collections={state.collections}
                        onSelect={( item ) => {
                            state.setMethod( item.method );
                            state.setUrl( item.url );
                        }}
                        onShowHistory={() => state.setShowHistory( !state.showHistory )}
                        onCreateCollection={() => {
                            notify( 'Creating collections is not implemented yet', 'info' );
                        }}
                    />
                </Col>

                <Col className="h-100 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        <RequestPanel
                            method={state.method}
                            setMethod={state.setMethod}
                            url={state.url}
                            setUrl={state.setUrl}
                            loading={loading}
                            activeConfigTab={state.activeConfigTab}
                            setActiveConfigTab={state.setActiveConfigTab}
                            onSend={handleSend}
                            onSave={handleSave}
                        />
                        <ResponsePanel
                            response={response}
                            loading={loading}
                            error={error}
                            onSave={() => notify( 'Saving response is not implemented yet', 'info' )}
                            onClear={() => state.setResponse( null )}
                        />
                    </div>
                </Col>

                {state.showHistory && (
                    <Col xs={3} className="bg-white h-100 border-start">
                        <HistorySidebar />
                    </Col>
                )}
            </Row>

            {state.showSettings && (
                <SettingsDialog onClose={() => state.setShowSettings( false )} />
            )}
        </Container>
    );
};

export default Transmit;
