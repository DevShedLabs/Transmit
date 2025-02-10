// src/components/Transmit/RequestPanel/ConfigTabs/Body.jsx
import React from 'react';

const Body = ( {
                   body, setBody,
                   bodyType, setBodyType,
                   bodyFormat, setBodyFormat,
                   method
               } ) => {
    if ( method === 'GET' ) return null;

    return (
        <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
                <select
                    value={bodyType}
                    onChange={( e ) => setBodyType( e.target.value )}
                    className="px-2 py-1 border rounded text-sm"
                >
                    <option value="raw">raw</option>
                    <option value="form-data">form-data</option>
                    <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
                </select>
                {bodyType === 'raw' && (
                    <select
                        value={bodyFormat}
                        onChange={( e ) => setBodyFormat( e.target.value )}
                        className="px-2 py-1 border rounded text-sm"
                    >
                        <option value="json">JSON</option>
                        <option value="text">Text</option>
                        <option value="xml">XML</option>
                    </select>
                )}
            </div>
            <textarea
                value={body}
                onChange={( e ) => setBody( e.target.value )}
                className="w-full h-48 px-3 py-2 font-mono border rounded"
                placeholder={bodyFormat === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body'}
            />
        </div>
    );
};

export default Body;