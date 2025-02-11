// src/components/Transmit/utils/request.js
import {replaceEnvironmentVariables} from './environment';

export class RequestError extends Error {
    constructor( message, details = {} ) {
        super( message );
        this.name    = 'RequestError';
        this.details = details;
    }
}

export const prepareRequestConfig = async ( request, environment ) => {
    try {
        let processedUrl = replaceEnvironmentVariables( request.url, environment );
        if ( request.params && request.params.length > 0 ) {
            const queryParams = request.params
                .filter( p => p.key && p.value )
                .map( p => `${encodeURIComponent( p.key )}=${encodeURIComponent( p.value )}` )
                .join( '&' );
            processedUrl += processedUrl.includes( '?' ) ? `&${queryParams}` : `?${queryParams}`;
        }

        const headers = new Headers();
        // Add default headers that browsers usually send
        headers.append( 'Accept', '*/*' );
        headers.append( 'Accept-Language', 'en-US,en;q=0.9' );
        headers.append( 'Connection', 'keep-alive' );

        if ( request.headers ) {
            request.headers.forEach( header => {
                if ( header.key && header.value ) {
                    headers.append( header.key, replaceEnvironmentVariables( header.value, environment ) );
                }
            } );
        }

        if ( request.auth ) {
            switch ( request.auth.type ) {
                case 'basic':
                    const credentials = btoa( `${request.auth.basic.username}:${request.auth.basic.password}` );
                    headers.append( 'Authorization', `Basic ${credentials}` );
                    break;
                case 'bearer':
                    headers.append( 'Authorization', `Bearer ${request.auth.bearer.token}` );
                    break;
                case 'apiKey':
                    if ( request.auth.apiKey.in === 'header' ) {
                        headers.append( request.auth.apiKey.key, request.auth.apiKey.value );
                    } else if ( request.auth.apiKey.in === 'query' ) {
                        const apiKeyParam = `${encodeURIComponent( request.auth.apiKey.key )}=${encodeURIComponent( request.auth.apiKey.value )}`;
                        processedUrl += processedUrl.includes( '?' ) ? `&${apiKeyParam}` : `?${apiKeyParam}`;
                    }
                    break;
            }
        }

        let body = undefined;
        if ( request.method !== 'GET' && request.method !== 'HEAD' ) {
            switch ( request.bodyType ) {
                case 'raw':
                    if ( request.bodyFormat === 'json' ) {
                        headers.append( 'Content-Type', 'application/json' );
                        try {
                            JSON.parse( request.body );
                            body = request.body;
                        } catch ( e ) {
                            throw new RequestError( 'Invalid JSON body', { cause: e } );
                        }
                    } else if ( request.bodyFormat === 'xml' ) {
                        headers.append( 'Content-Type', 'application/xml' );
                        body = request.body;
                    } else {
                        headers.append( 'Content-Type', 'text/plain' );
                        body = request.body;
                    }
                    break;

                case 'form-data':
                    const formData = new FormData();
                    try {
                        const data = JSON.parse( request.body );
                        Object.entries( data ).forEach( ( [ key, value ] ) => {
                            formData.append( key, value );
                        } );
                        body = formData;
                    } catch ( e ) {
                        throw new RequestError( 'Invalid form data', { cause: e } );
                    }
                    break;

                case 'x-www-form-urlencoded':
                    headers.append( 'Content-Type', 'application/x-www-form-urlencoded' );
                    try {
                        const data = JSON.parse( request.body );
                        body       = new URLSearchParams( data ).toString();
                    } catch ( e ) {
                        throw new RequestError( 'Invalid URL encoded data', { cause: e } );
                    }
                    break;
            }
        }

        // Return fetch configuration with more permissive settings
        return {
            method:         request.method,
            headers,
            body,
            url:            processedUrl,
            signal:         request.signal,
            credentials:    'omit', // Changed from 'same-origin' to 'include'
            mode:           'cors',
            cache:          'no-cache', // Changed from 'default' to 'no-cache'
            redirect:       request.settings?.followRedirects ? 'follow' : 'manual',
            referrerPolicy: 'no-referrer'
        };
    } catch ( error ) {
        if ( error instanceof RequestError ) {
            throw error;
        }
        throw new RequestError( 'Failed to prepare request', { cause: error } );
    }
};

export const executeRequest = async ( request, environment ) => {
    const startTime = Date.now();
    let responseData;

    try {
        const config   = await prepareRequestConfig( request, environment );
        const response = await fetch( config.url, config );

        // Process ALL headers immediately
        const headers = {};
        for ( const [ key, value ] of response.headers ) {
            // Preserve exact header case and handle multiple values
            if ( headers[ key ] ) {
                headers[ key ] = Array.isArray( headers[ key ] )
                                 ? [ ...headers[ key ], value ]
                                 : [ headers[ key ], value ];
            } else {
                headers[ key ] = value;
            }
        }

        const contentType = response.headers.get( 'content-type' );
        if ( contentType?.includes( 'application/json' ) ) {
            try {
                responseData = await response.json();
            } catch ( e ) {
                throw new RequestError( 'Invalid JSON response', { cause: e } );
            }
        } else if ( contentType?.includes( 'application/xml' ) || contentType?.includes( 'text/' ) ) {
            responseData = await response.text();
        } else {
            responseData = await response.blob();
        }

        return {
            status:     response.status,
            statusText: response.statusText,
            headers,
            data:       responseData,
            time:       Date.now() - startTime,
            size:       responseData instanceof Blob ? responseData.size : new Blob( [ JSON.stringify( responseData ) ] ).size
        };
    } catch ( error ) {
        if ( error instanceof RequestError ) {
            throw error;
        }
        throw new RequestError(
            error.message || 'Request failed',
            {
                cause: error,
                time:  Date.now() - startTime
            }
        );
    }
};
