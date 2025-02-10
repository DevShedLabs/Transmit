import React from 'react';
import {useTransmitState} from './hooks/useTransmitState';
import RequestPanel from './RequestPanel';
import ResponsePanel from './ResponsePanel';
import CollectionsSidebar from './sidebars/CollectionsSidebar';
import HistorySidebar from './sidebars/HistorySidebar';
import SettingsDialog from './dialogs/SettingsDialog';

const Transmit = () => {
    // Destructure everything we need from useTransmitState
    const {
              collections,
              method,
              setMethod,
              url,
              setUrl,
              headers,
              setHeaders,  // Make sure this is included
              params,
              setParams,
              body,
              setBody,
              bodyType,
              setBodyType,
              bodyFormat,
              setBodyFormat,
              response,
              responseView,
              setResponseView,
              loading,
              activeConfigTab,
              setActiveConfigTab,
              showHistory,
              setShowHistory,
              showSettings,
              setShowSettings,
              auth,
              setAuth,
              settings,
              setSettings
          } = useTransmitState();

    console.log( 'Transmit: setHeaders is', typeof setHeaders ); // Debug log

    const handleSend = () => {
        console.log( 'Sending request...', headers ); // Debug log
    };

    const handleSave = () => {
        console.log( 'Saving request...', headers ); // Debug log
    };

    return (
        <div className="flex h-screen max-h-screen bg-gray-100">
            <CollectionsSidebar
                collections={collections}
                onSelect={( item ) => {
                    setMethod( item.method );
                    setUrl( item.url );
                }}
                onShowHistory={() => setShowHistory( !showHistory )}
                onCreateCollection={() => {
                    console.log( 'Create collection' );
                }}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <RequestPanel
                    method={method}
                    setMethod={setMethod}
                    url={url}
                    setUrl={setUrl}
                    headers={headers}
                    setHeaders={setHeaders}  // Explicitly pass setHeaders
                    params={params}
                    setParams={setParams}
                    body={body}
                    setBody={setBody}
                    bodyType={bodyType}
                    setBodyType={setBodyType}
                    bodyFormat={bodyFormat}
                    setBodyFormat={setBodyFormat}
                    loading={loading}
                    activeConfigTab={activeConfigTab}
                    setActiveConfigTab={setActiveConfigTab}
                    auth={auth}
                    setAuth={setAuth}
                    settings={settings}
                    setSettings={setSettings}
                    onSend={handleSend}
                    onSave={handleSave}
                />
                <ResponsePanel
                    response={response}
                    responseView={responseView}
                    setResponseView={setResponseView}
                />
            </div>

            {showHistory && <HistorySidebar />}

            {showSettings && (
                <SettingsDialog onClose={() => setShowSettings( false )} />
            )}
        </div>
    );
};

export default Transmit;
