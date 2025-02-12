// src/components/Transmit/hooks/useRequest.js

import {useState, useCallback} from 'react';
import {executeRequest, RequestError} from '../utils/request';
import {useNotification} from '../context/NotificationContext';

export const useRequest = () => {
    const [ loading, setLoading ]   = useState( false );
    const [ error, setError ]       = useState( null );
    const [ response, setResponse ] = useState( null );
    const { notify }                = useNotification();

    const sendRequest = useCallback( async ( request, environment ) => {
        setLoading( true );
        setError( null );
        setResponse( null );

        try {
            const controller = new AbortController();
            request.signal   = controller.signal;

            const timeoutId = request.settings?.timeout
                              ? setTimeout( () => controller.abort(), request.settings.timeout )
                              : null;

            const response = await executeRequest( request, environment );
            if ( timeoutId ) clearTimeout( timeoutId );

            setResponse( response );
            notify( `Request completed successfully (${response.status})`, 'success' );

            return response;
        } catch ( error ) {
            const errorDetails = {
                message:   error instanceof RequestError ? error.message : 'Request failed',
                details:   error.details || {},
                timestamp: new Date().toISOString()
            };
            setError( errorDetails );
            notify( errorDetails.message, 'error' );
            throw error;
        } finally {
            setLoading( false );
        }
    }, [ notify ] );

    return {
        sendRequest,
        loading,
        error,
        response,
        clearError:    () => setError( null ),
        clearResponse: () => setResponse( null )
    };
};
