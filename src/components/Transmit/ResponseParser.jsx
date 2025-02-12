// src/components/ResponseParser.jsx
import React, {useState, useEffect} from 'react';
import {Card, Tab, Tabs} from '@/components/ui/card';

const ResponseParser = ( { responseText } ) => {
    const [ parsedResponse, setParsedResponse ] = useState( {
        statusCode: null,
        headers:    {},
        body:       null
    } );

    useEffect( () => {
        const parseResponse = ( text ) => {
            const sections = text.split( '\n\n' );
            const result   = {
                statusCode: null,
                headers:    {},
                body:       null
            };

            // Parse status code
            const statusMatch = sections[ 0 ].match( /Status Code: (\d+)/ );
            if ( statusMatch ) {
                result.statusCode = parseInt( statusMatch[ 1 ] );
            }

            // Parse headers
            const headerSection = sections[ 1 ];
            if ( headerSection && headerSection.startsWith( 'Headers:' ) ) {
                const headerLines = headerSection.replace( 'Headers:', '' ).trim().split( '\n' );
                headerLines.forEach( line => {
                    const [ key, ...valueParts ] = line.split( ':' );
                    if ( key && valueParts.length ) {
                        const value                  = valueParts.join( ':' ).trim();
                        result.headers[ key.trim() ] = value;
                    }
                } );
            }

            // Parse body
            const bodySection = sections[ 2 ];
            if ( bodySection && bodySection.startsWith( 'Body:' ) ) {
                try {
                    const bodyText = bodySection.replace( 'Body:', '' ).trim();
                    result.body    = JSON.parse( bodyText );
                } catch ( e ) {
                    console.error( 'Failed to parse JSON body:', e );
                    result.body = bodySection.replace( 'Body:', '' ).trim();
                }
            }

            return result;
        };

        if ( responseText ) {
            setParsedResponse( parseResponse( responseText ) );
        }
    }, [ responseText ] );

    const renderStatusBadge = () => {
        const getStatusColor = ( status ) => {
            if ( status >= 200 && status < 300 ) return 'bg-green-500';
            if ( status >= 300 && status < 400 ) return 'bg-blue-500';
            if ( status >= 400 && status < 500 ) return 'bg-yellow-500';
            if ( status >= 500 ) return 'bg-red-500';
            return 'bg-gray-500';
        };

        return (
            <div className={`inline-block px-2 py-1 rounded text-white ${getStatusColor( parsedResponse.statusCode )}`}>
                {parsedResponse.statusCode}
            </div>
        );
    };

    const renderHeaders = () => (
        <div className="space-y-2">
            {Object.entries( parsedResponse.headers ).map( ( [ key, value ] ) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-gray-600">{key}</div>
                    <div className="col-span-2 font-mono text-sm break-all">{value}</div>
                </div>
            ) )}
        </div>
    );

    const renderBody = () => {
        if ( !parsedResponse.body ) return null;

        return (
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
        <code>{JSON.stringify( parsedResponse.body, null, 2 )}</code>
      </pre>
        );
    };

    return (
        <Card className="w-full">
            <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold">Response</h3>
                    {parsedResponse.statusCode && renderStatusBadge()}
                </div>

                <Tabs defaultValue="body">
                    <Tab.List>
                        <Tab.Trigger value="body">Body</Tab.Trigger>
                        <Tab.Trigger value="headers">Headers</Tab.Trigger>
                    </Tab.List>
                    <Tab.Content value="body" className="mt-4">
                        {renderBody()}
                    </Tab.Content>
                    <Tab.Content value="headers" className="mt-4">
                        {renderHeaders()}
                    </Tab.Content>
                </Tabs>
            </div>
        </Card>
    );
};

export default ResponseParser;
