import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useTransmitState} from './hooks/useTransmitState';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import CollectionsSidebar from './sidebars/CollectionsSidebar';
import HistorySidebar from './sidebars/HistorySidebar';
import SettingsDialog from './dialogs/SettingsDialog';

const Transmit = () => {
    const state = useTransmitState();

    const handleSend = () => {
        console.log( 'Sending request...' );
    };

    const handleSave = () => {
        console.log( 'Saving request...' );
    };

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                {/* Left Sidebar */}
                <Col xs={2} className="bg-dark text-white h-100 border-end">
                    <CollectionsSidebar
                        collections={state.collections}
                        onSelect={( item ) => {
                            state.setMethod( item.method );
                            state.setUrl( item.url );
                        }}
                        onShowHistory={() => state.setShowHistory( !state.showHistory )}
                        onCreateCollection={() => {
                            console.log( 'Create collection' );
                        }}
                    />
                </Col>

                {/* Main Content Area */}
                <Col className="h-100 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        <RequestPanel
                            method={state.method}
                            setMethod={state.setMethod}
                            url={state.url}
                            setUrl={state.setUrl}
                            loading={state.loading}
                            activeConfigTab={state.activeConfigTab}
                            setActiveConfigTab={state.setActiveConfigTab}
                            onSend={handleSend}
                            onSave={handleSave}
                        />
                        <ResponsePanel
                            response={state.response}
                            responseView={state.responseView}
                            setResponseView={state.setResponseView}
                        />
                    </div>
                </Col>

                {/* Right Sidebar (History) */}
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