// src/components/Transmit/RequestPanel/ConfigTabs/Settings.jsx
import React from 'react';

const Settings = ( { settings, setSettings } ) => {
    return (
        <div className="mb-4 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Request Timeout (ms)</label>
                <input
                    type="number"
                    value={settings.timeout}
                    onChange={( e ) => setSettings( { ...settings, timeout: e.target.value } )}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Follow Redirects</label>
                <select
                    value={settings.followRedirects}
                    onChange={( e ) => setSettings( { ...settings, followRedirects: e.target.value === 'true' } )}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">SSL Verification</label>
                <select
                    value={settings.sslVerification}
                    onChange={( e ) => setSettings( { ...settings, sslVerification: e.target.value === 'true' } )}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;
