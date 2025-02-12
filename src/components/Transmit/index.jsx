// src/components/Transmit/index.jsx

import React, {useCallback, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useTransmitState} from './hooks/useTransmitState';
import {useRequest} from './hooks/useRequest';
import {useStorage} from './hooks/useStorage';
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
    const {
              collections,
              history,
              settings,
              saveCollection,
              addHistoryItem,
              updateSettings,
              saveWorkspaceState
          }                                         = useStorage();

    // Save workspace state when it changes
    useEffect( () => {
        saveWorkspaceState( {
            method:     state.method,
            url:        state.url,
            headers:    state.headers,
            params:     state.params,
            body:       state.body,
            bodyType:   state.bodyType,
            bodyFormat: state.bodyFormat,
            auth:       state.auth,
            settings:   state.settings
        } );
    }, [
        state.method,
        state.url,
        state.headers,
        state.params,
        state.body,
        state.bodyType,
        state.bodyFormat,
        state.auth,
        state.settings,
        saveWorkspaceState
    ] );

    const handleSend = useCallback( async () => {
        try {
            if ( !state.url ) {
                notify( 'Please enter a URL', 'error' );
                return;
            }

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

            // Add to history
            addHistoryItem( request, responseData );

            notify( 'Request sent successfully', 'success' );
        } catch ( err ) {
            notify( err.message || 'Failed to send request', 'error' );
        }
    }, [ state, sendRequest, notify, addHistoryItem ] );

    const handleSave = useCallback( () => {
        const request = {
            name:       `${state.method} ${state.url}`,
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

        const collectionName     = 'Default Collection'; // You might want to make this configurable
        const existingCollection = collections.find( c => c.name === collectionName );

        if ( existingCollection ) {
            saveCollection( {
                ...existingCollection,
                requests: [ ...existingCollection.requests, request ]
            } );
        } else {
            saveCollection( {
                name:     collectionName,
                requests: [ request ]
            } );
        }

        notify( 'Request saved to collection', 'success' );
    }, [ state, collections, saveCollection, notify ] );

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col xs={2} className="bg-dark text-white h-100 border-end">
                    <CollectionsSidebar
                        collections={collections}
                        onSelect={( item ) => {
                            state.setMethod( item.method );
                            state.setUrl( item.url );
                            if ( item.headers ) state.setHeaders( item.headers );
                            if ( item.params ) state.setParams( item.params );
                            if ( item.body ) state.setBody( item.body );
                            if ( item.bodyType ) state.setBodyType( item.bodyType );
                            if ( item.bodyFormat ) state.setBodyFormat( item.bodyFormat );
                            if ( item.auth ) state.setAuth( item.auth );
                        }}
                        onShowHistory={() => state.setShowHistory( !state.showHistory )}
                        onCreateCollection={() => {
                            // Implement collection creation dialog
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
                            onSave={handleSave}
                            onClear={() => state.setResponse( null )}
                        />
                    </div>
                </Col>
                {state.showHistory && (
                    <Col xs={3} className="bg-white h-100 border-start">
                        <HistorySidebar
                            history={history}
                            onSelect={( item ) => {
                                state.setMethod( item.request.method );
                                state.setUrl( item.request.url );
                                if ( item.request.headers ) state.setHeaders( item.request.headers );
                                if ( item.request.params ) state.setParams( item.request.params );
                                if ( item.request.body ) state.setBody( item.request.body );
                                if ( item.request.bodyType ) state.setBodyType( item.request.bodyType );
                                if ( item.request.bodyFormat ) state.setBodyFormat( item.request.bodyFormat );
                                if ( item.request.auth ) state.setAuth( item.request.auth );
                                state.setResponse( item.response );
                            }}
                        />
                    </Col>
                )}
            </Row>
            {state.showSettings && (
                <SettingsDialog
                    settings={settings}
                    onSave={updateSettings}
                    onClose={() => state.setShowSettings( false )}
                />
            )}
        </Container>
    );
};

export default Transmit;
