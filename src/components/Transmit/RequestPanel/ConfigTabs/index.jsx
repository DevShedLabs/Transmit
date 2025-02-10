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
                return <Headers />;  // No longer passing props since Headers manages its own state
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
