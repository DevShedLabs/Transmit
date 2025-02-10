// src/components/Transmit/utils/request.js
import { replaceEnvironmentVariables } from './environment';
export const sendRequest = async ( { method, url, headers, body, bodyType } ) => {
    const headerObj = headers.reduce( ( acc, { key, value } ) => {
        if ( key && value ) acc[ key ] = value;
        return acc;
    }, {} );

    const response = await fetch( url, {
        method,
        headers: headerObj,
        body:    method !== 'GET' ? getProcessedBody( body, bodyType ) : undefined
    } );

    const contentType  = response.headers.get( 'content-type' );
    const responseData = contentType?.includes( 'application/json' )
                         ? await response.json()
                         : await response.text();

    return {
        status:  response.status,
        headers: Object.fromEntries( response.headers.entries() ),
        data:    responseData,
        time:    new Date().toISOString()
    };
};

const getProcessedBody = ( body, bodyType ) => {
    if ( bodyType === 'raw' ) {
        return body;
    } else if ( bodyType === 'form-data' ) {
        const formData = new FormData();
        try {
            const data = JSON.parse( body );
            Object.entries( data ).forEach( ( [ key, value ] ) => {
                formData.append( key, value );
            } );
            return formData;
        } catch ( e ) {
            console.error( 'Invalid form data' );
            return body;
        }
    }
    return body;
};

export const prepareRequest = async (request, environment) => {
    const processedUrl = replaceEnvironmentVariables(request.url, environment);
    const headerObj = createHeadersObject(request.headers, request.auth);

    return {
        method: request.method,
        headers: headerObj,
        body: request.method !== 'GET' ? await processBody(request) : undefined
    };
};

const createHeadersObject = (headers, auth) => {
    const headerObj = headers.reduce((acc, { key, value }) => {
        if (key && value) acc[key] = value;
        return acc;
    }, {});

    // Add auth headers
    if (auth.type === 'basic') {
        const credentials = btoa(`${auth.basic.username}:${auth.basic.password}`);
        headerObj['Authorization'] = `Basic ${credentials}`;
    } else if (auth.type === 'bearer') {
        headerObj['Authorization'] = `Bearer ${auth.bearer.token}`;
    } else if (auth.type === 'apiKey' && auth.apiKey.in === 'header') {
        headerObj[auth.apiKey.key] = auth.apiKey.value;
    }

    return headerObj;
};

const processBody = async (request) => {
    if (request.bodyType === 'form-data') {
        const formData = new FormData();
        try {
            const data = JSON.parse(request.body);
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            return formData;
        } catch (e) {
            console.error('Invalid form data');
            return request.body;
        }
    }
    return request.body;
};
