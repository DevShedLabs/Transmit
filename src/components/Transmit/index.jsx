import React from 'react';
import {useTransmitState} from './hooks/useTransmitState';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import CollectionsSidebar from './sidebars/CollectionsSidebar';
import HistorySidebar from './sidebars/HistorySidebar';
import SettingsDialog from './dialogs/SettingsDialog';

const Transmit = () => {
    const state = useTransmitState();
    console.log( 'Transmit state:', state ); // Debug log

    const handleSend = () => {
        console.log( 'Sending request with headers:', state.headers );
    };

    const handleSave = () => {
        console.log( 'Saving request with headers:', state.headers );
    };

    return (
        <div className="flex h-screen max-h-screen bg-gray-100">
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <RequestPanel
                    // Pass all state and setters explicitly
                    method={state.method}
                    setMethod={state.setMethod}
                    url={state.url}
                    setUrl={state.setUrl}
                    headers={state.headers}
                    setHeaders={state.setHeaders} // Make sure setHeaders is passed
                    params={state.params}
                    setParams={state.setParams}
                    body={state.body}
                    setBody={state.setBody}
                    bodyType={state.bodyType}
                    setBodyType={state.setBodyType}
                    bodyFormat={state.bodyFormat}
                    setBodyFormat={state.setBodyFormat}
                    loading={state.loading}
                    activeConfigTab={state.activeConfigTab}
                    setActiveConfigTab={state.setActiveConfigTab}
                    auth={state.auth}
                    setAuth={state.setAuth}
                    settings={state.settings}
                    setSettings={state.setSettings}
                    onSend={handleSend}
                    onSave={handleSave}
                />
                <ResponsePanel
                    response={state.response}
                    responseView={state.responseView}
                    setResponseView={state.setResponseView}
                />
            </div>

            {state.showHistory && <HistorySidebar />}

            {state.showSettings && (
                <SettingsDialog onClose={() => state.setShowSettings( false )} />
            )}
        </div>
    );
};

export default Transmit;
