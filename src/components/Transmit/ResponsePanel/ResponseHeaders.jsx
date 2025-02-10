// src/components/Transmit/ResponsePanel/ResponseHeaders.jsx
import React from 'react';
import {Copy} from 'lucide-react';

const ResponseHeaders = ( { headers } ) => {
    const copyHeaders = () => {
        const text = Object.entries( headers )
            .map( ( [ key, value ] ) => `${key}: ${value}` )
            .join( '\n' );
        navigator.clipboard.writeText( text );
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Response Headers</h3>
                <button onClick={copyHeaders} className="p-1 hover:bg-gray-100 rounded">
                    <Copy className="w-4 h-4" />
                </button>
            </div>
            <div className="bg-gray-50 rounded p-2">
                {Object.entries( headers ).map( ( [ key, value ] ) => (
                    <div key={key} className="flex gap-4 text-sm">
                        <span className="font-medium text-gray-600">{key}:</span>
                        <span>{value}</span>
                    </div>
                ) )}
            </div>
        </div>
    );
};

export default ResponseHeaders;
