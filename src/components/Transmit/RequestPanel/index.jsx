// src/components/Transmit/RequestPanel/index.jsx
import React from 'react';
import URLBar from './URLBar';
import ConfigTabs from './ConfigTabs';


const RequestPanel = ({
                          method, setMethod,
                          url, setUrl,
                          loading,
                          activeConfigTab, setActiveConfigTab,
                          // ... other props
                      }) => {
    return (
        <div className="flex-1 overflow-auto">
            <div className="p-4 bg-white shadow">
                <URLBar
                    method={method}
                    setMethod={setMethod}
                    url={url}
                    setUrl={setUrl}
                    loading={loading}
                />
                <ConfigTabs
                    activeTab={activeConfigTab}
                    onTabChange={setActiveConfigTab}
                />
            </div>
        </div>
    );
};

export default RequestPanel;