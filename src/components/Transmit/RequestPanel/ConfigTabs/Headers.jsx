import React from 'react';

const Headers = ( { headers = [], setHeaders } ) => {
    console.log( 'Headers component received:', { headers, setHeaders } ); // Debug log

    // Validate that setHeaders is a function
    if ( typeof setHeaders !== 'function' ) {
        console.error( 'setHeaders is not a function:', setHeaders );
        return (
            <div className="text-red-500">
                Error: Headers component is not properly configured.
                Check the console for details.
            </div>
        );
    }

    const addHeader = () => {
        console.log( 'Adding header...' ); // Debug log
        try {
            setHeaders( [ ...headers, { key: '', value: '' } ] );
        } catch ( error ) {
            console.error( 'Error adding header:', error );
        }
    };

    const updateHeader = ( index, field, value ) => {
        try {
            const newHeaders = [ ...headers ];
            if ( !newHeaders[ index ] ) {
                newHeaders[ index ] = {};
            }
            newHeaders[ index ] = {
                ...newHeaders[ index ],
                [ field ]: value
            };
            setHeaders( newHeaders );
        } catch ( error ) {
            console.error( 'Error updating header:', error );
        }
    };

    const removeHeader = ( index ) => {
        try {
            setHeaders( headers.filter( ( _, i ) => i !== index ) );
        } catch ( error ) {
            console.error( 'Error removing header:', error );
        }
    };

    // Validate headers is an array
    const headersList = Array.isArray( headers ) ? headers : [];

    return (
        <div className="mb-4">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-2">
                <div className="text-sm text-gray-600">Key</div>
                <div className="text-sm text-gray-600">Value</div>
                <div></div>
                {headersList.map( ( header, index ) => (
                    <React.Fragment key={index}>
                        <input
                            type="text"
                            value={header?.key || ''}
                            onChange={( e ) => updateHeader( index, 'key', e.target.value )}
                            placeholder="Key"
                            className="px-3 py-2 border rounded"
                        />
                        <input
                            type="text"
                            value={header?.value || ''}
                            onChange={( e ) => updateHeader( index, 'value', e.target.value )}
                            placeholder="Value"
                            className="px-3 py-2 border rounded"
                        />
                        <button
                            onClick={() => removeHeader( index )}
                            className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            ×
                        </button>
                    </React.Fragment>
                ) )}
            </div>
            <button
                onClick={addHeader}
                className="mt-2 px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
            >
                + Add Header
            </button>
        </div>
    );
};

export default Headers;
