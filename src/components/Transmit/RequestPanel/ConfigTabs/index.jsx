// src/components/Transmit/RequestPanel/ConfigTabs/index.jsx
import React from 'react';
import Headers from './Headers';
import Params from './Params';
import Body from './Body';
import Auth from './Auth';
import Settings from './Settings';

const ConfigTabs = ( { activeTab, onTabChange } ) => {
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
                return <Headers />;
            case 'params':
                return <Params />;
            case 'body':
                return <Body />;
            case 'auth':
                return <Auth />;
            case 'settings':
                return <Settings />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="bg-light border-bottom">
                <div className="d-flex">
                    {tabs.map( tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange( tab.id )}
                            className={`config-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ) )}
                </div>
            </div>
            <div className="p-3">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ConfigTabs;
