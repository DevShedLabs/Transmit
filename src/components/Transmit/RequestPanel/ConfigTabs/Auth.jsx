// src/components/Transmit/RequestPanel/ConfigTabs/Auth.jsx
import React from 'react';

const Auth = ( { auth, setAuth, handleAuthChange } ) => {
    return (
        <div className="mb-4 space-y-4">
            <div>
                <select
                    value={auth.type}
                    onChange={( e ) => setAuth( { ...auth, type: e.target.value } )}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="none">No Auth</option>
                    <option value="basic">Basic Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="apiKey">API Key</option>
                </select>
            </div>

            {auth.type === 'basic' && (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={auth.basic.username}
                        onChange={( e ) => handleAuthChange( 'basic', 'username', e.target.value )}
                        placeholder="Username"
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="password"
                        value={auth.basic.password}
                        onChange={( e ) => handleAuthChange( 'basic', 'password', e.target.value )}
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            )}

            {auth.type === 'bearer' && (
                <input
                    type="text"
                    value={auth.bearer.token}
                    onChange={( e ) => handleAuthChange( 'bearer', 'token', e.target.value )}
                    placeholder="Token"
                    className="w-full px-3 py-2 border rounded"
                />
            )}

            {auth.type === 'apiKey' && (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={auth.apiKey.key}
                        onChange={( e ) => handleAuthChange( 'apiKey', 'key', e.target.value )}
                        placeholder="Key"
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        value={auth.apiKey.value}
                        onChange={( e ) => handleAuthChange( 'apiKey', 'value', e.target.value )}
                        placeholder="Value"
                        className="w-full px-3 py-2 border rounded"
                    />
                    <select
                        value={auth.apiKey.in}
                        onChange={( e ) => handleAuthChange( 'apiKey', 'in', e.target.value )}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="header">Header</option>
                        <option value="query">Query Param</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Auth;
