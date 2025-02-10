import React from 'react';
import Headers from './Headers';
import Params from './Params';
import Body from './Body';
import Auth from './Auth';
import Settings from './Settings';

const ConfigTabs = ( {
                         activeTab,
                         headers,
                         setHeaders,  // Make sure this prop is included
                         params,
                         setParams,
                         body,
                         setBody,
                         bodyType,
                         setBodyType,
                         bodyFormat,
                         setBodyFormat,
                         method,
                         auth,
                         setAuth,
                         settings,
                         setSettings,
                         onTabChange
                     } ) => {
    const tabs = [
        { id: 'headers', label: 'Headers' },
        { id: 'params', label: 'Params' },
        { id: 'body', label: 'Body' },
        { id: 'auth', label: 'Auth' },
        { id: 'settings', label: 'Settings' }
    ];

    const renderTabContent = () => {
        switch ( activeTab ) {
            case 'headers':
                return (
                    <Headers
                        headers={headers}
                        setHeaders={setHeaders}  // Explicitly pass setHeaders
                    />
                );
            case 'params':
                return (
                    <Params
                        params={params}
                        setParams={setParams}
                    />
                );
            case 'body':
                return (
                    <Body
                        body={body}
                        setBody={setBody}
                        bodyType={bodyType}
                        setBodyType={setBodyType}
                        bodyFormat={bodyFormat}
                        setBodyFormat={setBodyFormat}
                        method={method}
                    />
                );
            case 'auth':
                return (
                    <Auth
                        auth={auth}
                        setAuth={setAuth}
                    />
                );
            case 'settings':
                return (
                    <Settings
                        settings={settings}
                        setSettings={setSettings}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="border-b mb-4">
                <div className="flex gap-4">
                    {tabs.map( tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange( tab.id )}
                            className={`px-4 py-2 ${
                                activeTab === tab.id ? 'border-b-2 border-blue-500' : ''
                            }`}
                        >
                            {tab.label}
                        </button>
                    ) )}
                </div>
            </div>
            {renderTabContent()}
        </div>
    );
};

export default ConfigTabs;
