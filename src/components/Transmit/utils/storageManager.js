// src/components/Transmit/utils/storageManager.js

import {v4 as uuidv4} from 'uuid';

const STORAGE_KEYS = {
    COLLECTIONS: 'transmit:collections',
    HISTORY:     'transmit:history',
    WORKSPACE:   'transmit:workspace',
    SETTINGS:    'transmit:settings'
};

const MAX_HISTORY_ITEMS = 100;

class StorageManager {
    constructor() {
        this.subscribers = new Map();
    }

    // Helper methods for localStorage operations
    _save( key, value ) {
        try {
            localStorage.setItem( key, JSON.stringify( value ) );
            this._notifySubscribers( key, value );
        } catch ( error ) {
            console.error( `Error saving to ${key}:`, error );
            throw new Error( `Failed to save data: ${error.message}` );
        }
    }

    _load( key, defaultValue = null ) {
        try {
            const data = localStorage.getItem( key );
            return data ? JSON.parse( data ) : defaultValue;
        } catch ( error ) {
            console.error( `Error loading from ${key}:`, error );
            return defaultValue;
        }
    }

    // Subscription management
    subscribe( key, callback ) {
        if ( !this.subscribers.has( key ) ) {
            this.subscribers.set( key, new Set() );
        }
        this.subscribers.get( key ).add( callback );

        // Return unsubscribe function
        return () => {
            this.subscribers.get( key )?.delete( callback );
        };
    }

    _notifySubscribers( key, value ) {
        this.subscribers.get( key )?.forEach( callback => callback( value ) );
    }

    // Collections Management
    getCollections() {
        return this._load( STORAGE_KEYS.COLLECTIONS, [] );
    }

    saveCollection( collection ) {
        const collections   = this.getCollections();
        const newCollection = {
            id:          collection.id || uuidv4(),
            name:        collection.name,
            description: collection.description,
            requests:    collection.requests || [],
            createdAt:   collection.createdAt || new Date().toISOString(),
            updatedAt:   new Date().toISOString()
        };

        const existingIndex = collections.findIndex( c => c.id === newCollection.id );
        if ( existingIndex >= 0 ) {
            collections[ existingIndex ] = newCollection;
        } else {
            collections.push( newCollection );
        }

        this._save( STORAGE_KEYS.COLLECTIONS, collections );
        return newCollection;
    }

    deleteCollection( collectionId ) {
        const collections = this.getCollections().filter( c => c.id !== collectionId );
        this._save( STORAGE_KEYS.COLLECTIONS, collections );
    }

    // Request History Management
    getHistory() {
        return this._load( STORAGE_KEYS.HISTORY, [] );
    }

    addHistoryItem( request, response ) {
        const history     = this.getHistory();
        const historyItem = {
            id:        uuidv4(),
            request,
            response,
            timestamp: new Date().toISOString()
        };

        history.unshift( historyItem );

        // Limit history size
        if ( history.length > MAX_HISTORY_ITEMS ) {
            history.pop();
        }

        this._save( STORAGE_KEYS.HISTORY, history );
        return historyItem;
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
