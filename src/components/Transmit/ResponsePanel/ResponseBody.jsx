// src/components/Transmit/ResponsePanel/ResponseBody.jsx
import React from 'react';
import {Copy} from 'lucide-react';

const ResponseBody = ( { data, view } ) => {
    const [ indentation, setIndentation ] = React.useState( 2 );

    const copyFormatted = () => {
        const text = typeof data === 'object'
                     ? JSON.stringify( data, null, indentation )
                     : data;
        navigator.clipboard.writeText( text );
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Response Body</h3>
                <div className="flex items-center gap-2">
                    {typeof data === 'object' && (
                        <select
                            className="text-sm border rounded px-2 py-1"
                            value={indentation}
                            onChange={( e ) => setIndentation( Number( e.target.value ) )}
                        >
                            <option value="2">2 Space</option>
                            <option value="4">4 Space</option>
                            <option value="0">Compact</option>
                        </select>
                    )}
                    <button onClick={copyFormatted} className="p-1 hover:bg-gray-100 rounded">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 rounded">
                {view === 'pretty' && typeof data === 'object' && (
                    <pre className="p-4 overflow-auto">
            {JSON.stringify( data, null, indentation )}
          </pre>
                )}
                {view === 'raw' && (
                    <pre className="p-4 overflow-auto">
            {typeof data === 'object' ? JSON.stringify( data ) : data}
          </pre>
                )}
                {view === 'preview' && (
                    <div
                        className="p-4"
                        dangerouslySetInnerHTML={{
                            __html: typeof data === 'string' ? data : ''
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ResponseBody;
