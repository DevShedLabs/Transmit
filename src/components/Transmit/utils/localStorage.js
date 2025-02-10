// src/components/Transmit/utils/localStorage.js
import {saveToStorage, loadFromStorage} from './storage';  // Add this import

const STORAGE_KEYS = {
    COLLECTIONS:  'transmit:collections',
    ENVIRONMENTS: 'transmit:environments',
    HISTORY:      'transmit:history',
    SETTINGS:     'transmit:settings'
};

const defaultSettings = {
    timeout:         30000,
    followRedirects: true,
    sslVerification: true,
    theme:           'light'
};

export const storage = {
    collections:  {
        get: () => loadFromStorage( STORAGE_KEYS.COLLECTIONS, [] ),
        set: ( collections ) => saveToStorage( STORAGE_KEYS.COLLECTIONS, collections ),
        add: ( collection ) => {
            const collections = loadFromStorage( STORAGE_KEYS.COLLECTIONS, [] );
            collections.push( collection );
            saveToStorage( STORAGE_KEYS.COLLECTIONS, collections );
        }
    },
    environments: {
        get: () => loadFromStorage( STORAGE_KEYS.ENVIRONMENTS, [] ),
        set: ( environments ) => saveToStorage( STORAGE_KEYS.ENVIRONMENTS, environments ),
        add: ( environment ) => {
            const environments = loadFromStorage( STORAGE_KEYS.ENVIRONMENTS, [] );
            environments.push( environment );
            saveToStorage( STORAGE_KEYS.ENVIRONMENTS, environments );
        }
    },
    history:      {
        get: () => loadFromStorage( STORAGE_KEYS.HISTORY, [] ),
        set: ( history ) => saveToStorage( STORAGE_KEYS.HISTORY, history ),
        add: ( item ) => {
            const history = loadFromStorage( STORAGE_KEYS.HISTORY, [] );
            history.unshift( item );
            if ( history.length > 50 ) history.pop();
            saveToStorage( STORAGE_KEYS.HISTORY, history );
        }
    },
    settings:     {
        get: () => loadFromStorage( STORAGE_KEYS.SETTINGS, defaultSettings ),
        set: ( settings ) => saveToStorage( STORAGE_KEYS.SETTINGS, settings )
    }
};