// src/components/Transmit/utils/request.js

import {replaceEnvironmentVariables} from './environment';

export class RequestError extends Error {
    constructor( message, details = {} ) {
        super( message );
        this.name    = 'RequestError';
        this.details = details;
    }
}

const PROXY_URL = 'http://localhost/tools/Transmit/proxy.php';

export const executeRequest = async ( request, environment ) => {
    const startTime = Date.now();

    try {
        // Process request data
        const processedUrl = replaceEnvironmentVariables( request.url, environment );

        // Prepare request data for proxy
        const proxyData = {
            url:     processedUrl,
            method:  request.method,
            headers: request.headers?.filter( h => h.key && h.value ) || [],
            body:    request.body
        };

        console.log( 'Sending request to proxy:', {
            url:  PROXY_URL,
            data: proxyData
        } );

        // Make request to proxy
        const response = await fetch( PROXY_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json'
            },
            body:    JSON.stringify( proxyData )
        } ).catch( error => {
            console.error( 'Fetch error:', error );
            throw new Error( `Failed to connect to proxy: ${error.message}` );
        } );

        if ( !response.ok ) {
            const errorText = await response.text();
            console.error( 'Proxy error response:', {
                status:     response.status,
                statusText: response.statusText,
                body:       errorText
            } );
            throw new Error( `Proxy returned status ${response.status}: ${errorText}` );
        }

        // Parse proxy response
        const proxyResponse = await response.json().catch( error => {
            console.error( 'JSON parse error:', error );
            throw new Error( 'Invalid JSON response from proxy' );
        } );

        if ( proxyResponse.error ) {
            console.error( 'Proxy reported error:', proxyResponse.error );
            throw new Error( proxyResponse.error );
        }

        console.log( 'Successful proxy response:', proxyResponse );

        return {
            status:     proxyResponse.status,
            statusText: proxyResponse.headers?.status || '',
            headers:    proxyResponse.headers || {},
            data:       proxyResponse.body,
            time:       Date.now() - startTime,
            size:       new Blob( [
                typeof proxyResponse.body === 'string'
                ? proxyResponse.body
                : JSON.stringify( proxyResponse.body )
            ] ).size
        };
    } catch ( error ) {
        console.error( 'Request execution error:', error );
        throw new RequestError(
            error.message || 'Request failed',
            {
                cause: error,
                time:  Date.now() - startTime
            }
        );
    }
};
