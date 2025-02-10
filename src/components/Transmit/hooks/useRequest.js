// src/components/Transmit/hooks/useRequest.js
import {useState, useCallback} from 'react';
import {executeRequest, RequestError} from '../utils/request';
import {storage} from '../utils/localStorage';

export const useRequest = () => {
    const { notify }                = useNotification();
    const [ loading, setLoading ]   = useState( false );
    const [ error, setError ]       = useState( null );
    const [ response, setResponse ] = useState( null );

    const sendRequest = useCallback( async ( request, environment ) => {
        setLoading( true );
        setError( null );
        setResponse( null );

        try {
            // Create abort controller for request cancellation
            const controller = new AbortController();
            request.signal   = controller.signal;

            // Set timeout if specified in settings
            const timeoutId = request.settings?.timeout
                              ? setTimeout( () => controller.abort(), request.settings.timeout )
                              : null;

            const response = await executeRequest( request, environment );

            // Clear timeout if request completed
            if ( timeoutId ) clearTimeout( timeoutId );

            // Store in history
            storage.history.add( {
                request,
                response,
                timestamp: new Date().toISOString()
            } );

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
    }, [] );

    return {
        sendRequest,
        loading,
        error,
        response,
        clearError:    () => setError( null ),
        clearResponse: () => setResponse( null )
    };
};
