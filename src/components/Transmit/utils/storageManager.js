// src/components/Transmit/utils/storageManager.js

const STORAGE_KEYS = {
    COLLECTIONS: 'transmit:collections',
    HISTORY:     'transmit:history',
    WORKSPACE:   'transmit:workspace',
    SETTINGS:    'transmit:settings'
};

const MAX_HISTORY_ITEMS = 100;

// Simple UUID generator
const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : ( r & 0x3 | 0x8 );
        return v.toString( 16 );
    } );
};

class StorageManager {
    constructor() {
        this.subscribers = new Map();
        console.log( 'StorageManager initialized' );
        console.log( 'Initial collections:', this.getCollections() );
    }

    _save( key, value ) {
        try {
            console.log( `Saving to ${key}:`, value );
            localStorage.setItem( key, JSON.stringify( value ) );
            this._notifySubscribers( key, value );
            console.log( `Successfully saved to ${key}` );
            return true;
        } catch ( error ) {
            console.error( `Error saving to ${key}:`, error );
            throw new Error( `Failed to save data: ${error.message}` );
        }
    }

    _load( key, defaultValue = null ) {
        try {
            const data = localStorage.getItem( key );
            console.log( `Loading from ${key}:`, data );
            return data ? JSON.parse( data ) : defaultValue;
        } catch ( error ) {
            console.error( `Error loading from ${key}:`, error );
            return defaultValue;
        }
    }

    subscribe( key, callback ) {
        console.log( `New subscriber for ${key}` );
        if ( !this.subscribers.has( key ) ) {
            this.subscribers.set( key, new Set() );
        }
        this.subscribers.get( key ).add( callback );

        return () => {
            this.subscribers.get( key )?.delete( callback );
        };
    }

    _notifySubscribers( key, value ) {
        console.log( `Notifying subscribers for ${key}`, value );
        const subscribers = this.subscribers.get( key );
        if ( subscribers ) {
            subscribers.forEach( callback => {
                try {
                    callback( value );
                } catch ( error ) {
                    console.error( 'Error in subscriber callback:', error );
                }
            } );
        }
    }

    getCollections() {
        const collections = this._load( STORAGE_KEYS.COLLECTIONS, [] );
        console.log( 'Getting collections:', collections );
        return collections;
    }

    saveCollection( collection ) {
        console.log( 'Saving collection:', collection );
        const collections = this.getCollections();

        const newCollection = {
            id:          collection.id || generateId(),
            name:        collection.name,
            description: collection.description,
            requests:    collection.requests || [],
            createdAt:   collection.createdAt || new Date().toISOString(),
            updatedAt:   new Date().toISOString()
        };

        const existingIndex = collections.findIndex( c => c.id === newCollection.id );

        let updatedCollections;
        if ( existingIndex >= 0 ) {
            updatedCollections                  = [ ...collections ];
            updatedCollections[ existingIndex ] = newCollection;
        } else {
            updatedCollections = [ ...collections, newCollection ];
        }

        this._save( STORAGE_KEYS.COLLECTIONS, updatedCollections );
        console.log( 'Collection saved, new state:', updatedCollections );
        return newCollection;
    }

    deleteCollection( collectionId ) {
        console.log( 'Deleting collection:', collectionId );
        const collections = this.getCollections().filter( c => c.id !== collectionId );
        this._save( STORAGE_KEYS.COLLECTIONS, collections );
        console.log( 'Collection deleted, new state:', collections );
    }


    // Request History Management
    getHistory() {
        return this._load( STORAGE_KEYS.HISTORY, [] );
    }

    addHistoryItem( request, response ) {
        const history = this.getHistory();

        // Create history item
        const historyItem = {
            id:        generateId(),
            request,
            response,
            timestamp: new Date().toISOString()
        };

        // Check for duplicates within the last second (to prevent double entries)
        const isDuplicate = history.some( item => {
            const timeDiff = Math.abs(
                new Date( item.timestamp ) - new Date( historyItem.timestamp )
            );
            return (
                timeDiff < 1000 && // Within 1 second
                item.request.method === request.method &&
                item.request.url === request.url
            );
        } );

        if ( !isDuplicate ) {
            history.unshift( historyItem );

            // Limit history size
            if ( history.length > MAX_HISTORY_ITEMS ) {
                history.pop();
            }

            this._save( STORAGE_KEYS.HISTORY, history );
            return historyItem;
        }

        return null;
    }


    clearHistory() {
        this._save( STORAGE_KEYS.HISTORY, [] );
    }

    // Workspace Management (for current session state)
    saveWorkspaceState( state ) {
        this._save( STORAGE_KEYS.WORKSPACE, {
            ...state,
            lastUpdated: new Date().toISOString()
        } );
    }

    getWorkspaceState() {
        return this._load( STORAGE_KEYS.WORKSPACE, {
            tabs:        [],
            activeTab:   null,
            lastUpdated: null
        } );
    }

    // Settings Management
    getSettings() {
        return this._load( STORAGE_KEYS.SETTINGS, {
            theme:           'light',
            fontSize:        14,
            timeout:         30000,
            followRedirects: true,
            validateSSL:     true
        } );
    }

    updateSettings( settings ) {
        const currentSettings = this.getSettings();
        this._save( STORAGE_KEYS.SETTINGS, {
            ...currentSettings,
            ...settings,
            updatedAt: new Date().toISOString()
        } );
    }

    // Export/Import functionality
    exportData() {
        return {
            collections: this.getCollections(),
            settings:    this.getSettings(),
            exportedAt:  new Date().toISOString(),
            version:     '1.0'
        };
    }

    importData( data ) {
        if ( !data.version || !data.collections ) {
            throw new Error( 'Invalid import data format' );
        }

        // Import collections
        data.collections.forEach( collection => {
            this.saveCollection( collection );
        } );

        // Import settings if present
        if ( data.settings ) {
            this.updateSettings( data.settings );
        }

        return true;
    }

    // Utility methods
    clear() {
        Object.values( STORAGE_KEYS ).forEach( key => {
            localStorage.removeItem( key );
            this._notifySubscribers( key, null );
        } );
    }
}

// Create and export a singleton instance
export const storageManager = new StorageManager();

// Export types for TypeScript support
export const StorageEvents = STORAGE_KEYS;
