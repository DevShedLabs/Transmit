import {useState} from 'react';
import {storage} from '../utils/localStorage';

export const useTransmitState = () => {
    // Initialize headers state first
    const [ headers, setHeaders ] = useState( [
        { key: '', value: '' }
    ] );

    console.log( 'useTransmitState: setHeaders is', typeof setHeaders ); // Debug log

    const [ activeConfigTab, setActiveConfigTab ] = useState( 'headers' );
    const [ tabs, setTabs ]                       = useState( [
        { id: '1', name: 'New Request', request: { method: 'GET', url: '', headers: [], body: '' } }
    ] );
    const [ activeTab, setActiveTab ]             = useState( '1' );
    const [ method, setMethod ]                   = useState( 'GET' );
    const [ url, setUrl ]                         = useState( '' );
    const [ params, setParams ]                   = useState( [ { key: '', value: '' } ] );
    const [ body, setBody ]                       = useState( '' );
    const [ bodyType, setBodyType ]               = useState( 'raw' );
    const [ bodyFormat, setBodyFormat ]           = useState( 'json' );
    const [ response, setResponse ]               = useState( null );
    const [ responseView, setResponseView ]       = useState( 'pretty' );
    const [ loading, setLoading ]                 = useState( false );
    const [ error, setError ]                     = useState( null );
    const [ showHistory, setShowHistory ]         = useState( false );
    const [ showSettings, setShowSettings ]       = useState( false );
    const [ auth, setAuth ]                       = useState( { type: 'none' } );
    const [ settings, setSettings ]               = useState( {
        timeout:         30000,
        followRedirects: true,
        sslVerification: true
    } );
    const [ collections, setCollections ]         = useState( () => {
        return storage.collections.get() || [
            {
                id:    '1',
                name:  'Example Collection',
                items: [
                    {
                        id:     '1',
                        name:   'Get Users',
                        method: 'GET',
                        url:    'https://api.example.com/users'
                    }
                ]
            }
        ];
    } );

    const state = {
        collections,
        setCollections,
        activeConfigTab,
        setActiveConfigTab,
        tabs,
        setTabs,
        activeTab,
        setActiveTab,
        method,
        setMethod,
        url,
        setUrl,
        headers,
        setHeaders, // Make sure this is included
        params,
        setParams,
        body,
        setBody,
        bodyType,
        setBodyType,
        bodyFormat,
        setBodyFormat,
        response,
        setResponse,
        responseView,
        setResponseView,
        loading,
        setLoading,
        error,
        setError,
        showHistory,
        setShowHistory,
        showSettings,
        setShowSettings,
        auth,
        setAuth,
        settings,
        setSettings,
    };

    console.log( 'useTransmitState returning:', state ); // Debug log
    return state;
};

export default useTransmitState;