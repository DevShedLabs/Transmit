// src/components/Transmit/hooks/useRequest.js
import {useState} from 'react';
import {prepareRequest} from '../utils/request';
import {storage} from '../utils/localStorage';

export const useRequest = () => {
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ]     = useState( null );

    const sendRequest = async ( request, environment ) => {
        setLoading( true );
        setError( null );

        try {
            const config   = await prepareRequest( request, environment );
            const response = await fetch( request.url, config );

            const contentType = response.headers.get( 'content-type' );
            const data        = contentType?.includes( 'application/json' )
                                ? await response.json()
                                : await response.text();

            const responseObj = {
                status:  response.status,
                headers: Object.fromEntries( response.headers.entries() ),
                data,
                time:    new Date().toISOString()
            };

            // Add to history
            storage.history.add( {
                request,
                response:  responseObj,
                timestamp: new Date().toISOString()
            } );

            return responseObj;
        } catch ( err ) {
            setError( err.message );
            throw err;
        } finally {
            setLoading( false );
        }
    };

    return {
        sendRequest,
        loading,
        error
    };
};
