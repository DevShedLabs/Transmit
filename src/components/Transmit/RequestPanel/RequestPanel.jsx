import React from 'react';
import URLBar from './URLBar';
import ConfigTabs from './ConfigTabs';

const RequestPanel = ( {
                           method,
                           setMethod,
                           url,
                           setUrl,
                           loading,
                           activeConfigTab,
                           setActiveConfigTab,
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
                           auth,
                           setAuth,
                           settings,
                           setSettings,
                           onSend,
                           onSave
                       } ) => {
    return (
        <div className="flex-1 overflow-auto">
            <div className="p-4 bg-white shadow">
                <URLBar
                    method={method}
                    setMethod={setMethod}
                    url={url}
                    setUrl={setUrl}
                    loading={loading}
                    onSend={onSend}
                    onSave={onSave}
                />
                <ConfigTabs
                    activeTab={activeConfigTab}
                    onTabChange={setActiveConfigTab}
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
                    method={method}
                    auth={auth}
                    setAuth={setAuth}
                    settings={settings}
                    setSettings={setSettings}
                />
            </div>
        </div>
    );
};

export default RequestPanel;
