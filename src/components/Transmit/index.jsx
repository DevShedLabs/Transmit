// src/components/Transmit/index.jsx
import React, {useCallback, useEffect, useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useTransmitState} from './hooks/useTransmitState';
import {useRequest} from './hooks/useRequest';
import {useStorage} from './hooks/useStorage';
import {storageManager} from './utils/storageManager';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import CollectionsSidebar from './sidebars/CollectionsSidebar';
import HistorySidebar from './sidebars/HistorySidebar';
import SettingsDialog from './dialogs/SettingsDialog';
import SaveRequestDialog from './dialogs/SaveRequestDialog';
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
              deleteCollection,
              addHistoryItem,
              updateSettings,
              saveWorkspaceState
          }                                         = useStorage();

    const [ showSaveRequest, setShowSaveRequest ] = useState( false );

    const generateId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        } );
    };

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
            addHistoryItem( request, responseData );
            notify( 'Request sent successfully', 'success' );
        } catch ( err ) {
            notify( err.message || 'Failed to send request', 'error' );
        }
    }, [ state, sendRequest, notify, addHistoryItem ] );


    const handleCreateCollection = useCallback( async ( collection ) => {
        try {
            console.log( 'Creating collection:', collection );
            const newCollection = {
                ...collection,
                id:        generateId(),
                requests:  [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save to storage
            const updatedCollections = [ ...( collections || [] ), newCollection ];
            await storageManager._save( 'transmit:collections', updatedCollections );

            notify( 'Collection created successfully', 'success' );
            return newCollection; // Return the new collection
        } catch ( error ) {
            console.error( 'Failed to create collection:', error );
            notify( 'Failed to create collection: ' + error.message, 'error' );
            throw error;
        }
    }, [ collections, notify ] );

    const handleRenameCollection = useCallback( ( collectionId, newName ) => {
        try {
            if ( !collections ) return;
            const updatedCollections = collections.map( c =>
                c.id === collectionId
                ? {
                        ...c,
                        name:      newName,
                        updatedAt: new Date().toISOString()
                    }
                : c
            );
            storageManager._save( 'transmit:collections', updatedCollections );
            notify( 'Collection renamed successfully', 'success' );
        } catch ( error ) {
            console.error( 'Failed to rename collection:', error );
            notify( 'Failed to rename collection', 'error' );
        }
    }, [ collections, notify ] );


    const handleDeleteCollection = useCallback( ( collectionId ) => {
        try {
            if ( !collections ) return;
            const updatedCollections = collections.filter( c => c.id !== collectionId );
            storageManager._save( 'transmit:collections', updatedCollections );
            notify( 'Collection deleted successfully', 'success' );
        } catch ( error ) {
            console.error( 'Failed to delete collection:', error );
            notify( 'Failed to delete collection', 'error' );
        }
    }, [ collections, notify ] );

    const handleSaveRequest = useCallback( ( { collectionId, request } ) => {
        try {
            if ( !collections ) return;
            const collection = collections.find( c => c.id === collectionId );
            if ( !collection ) throw new Error( 'Collection not found' );

            const newRequest = {
                id:          generateId(),
                name:        request.name,
                description: request.description,
                method:      state.method,
                url:         state.url,
                headers:     state.headers.filter( h => h.key && h.value ),
                params:      state.params.filter( p => p.key && p.value ),
                body:        state.body,
                bodyType:    state.bodyType,
                bodyFormat:  state.bodyFormat,
                auth:        state.auth,
                createdAt:   new Date().toISOString()
            };

            const updatedCollections = collections.map( c =>
                c.id === collectionId
                ? {
                        ...c,
                        requests:  [ ...c.requests, newRequest ],
                        updatedAt: new Date().toISOString()
                    }
                : c
            );

            storageManager._save( 'transmit:collections', updatedCollections );
            notify( 'Request saved to collection', 'success' );
            setShowSaveRequest( false );
        } catch ( error ) {
            console.error( 'Failed to save request:', error );
            notify( 'Failed to save request: ' + error.message, 'error' );
        }
    }, [ state, collections, notify ] );


    const handleDeleteRequest = useCallback( ( collectionId, requestId ) => {
        try {
            if ( !collections ) return;

            const collection = collections.find( c => c.id === collectionId );
            if ( !collection ) return;

            const updatedCollections = collections.map( c =>
                c.id === collectionId
                ? {
                        ...c,
                        requests:  c.requests.filter( r => r.id !== requestId ),
                        updatedAt: new Date().toISOString()
                    }
                : c
            );

            storageManager._save( 'transmit:collections', updatedCollections );
            notify( 'Request deleted successfully', 'success' );
        } catch ( error ) {
            console.error( 'Failed to delete request:', error );
            notify( 'Failed to delete request', 'error' );
        }
    }, [ collections, notify ] );

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col xs={2} className="bg-dark text-white h-100 border-end">
                    <CollectionsSidebar
                        collections={collections || []}
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
                        onCreateCollection={handleCreateCollection}
                        onDeleteCollection={handleDeleteCollection}
                        onDeleteRequest={handleDeleteRequest}
                        onRenameCollection={handleRenameCollection}
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
                            onSave={() => setShowSaveRequest( true )}
                        />
                        <ResponsePanel
                            response={response}
                            loading={loading}
                            error={error}
                            onSave={() => setShowSaveRequest( true )}
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

            {showSaveRequest && (
                <SaveRequestDialog
                    show={showSaveRequest}
                    onHide={() => setShowSaveRequest( false )}
                    collections={collections || []}
                    onSave={handleSaveRequest}
                    onCreateCollection={handleCreateCollection}
                />
            )}

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
