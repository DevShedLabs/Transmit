// src/components/Transmit/utils/storage.js

export const saveToStorage = ( key, value ) => {
    try {
        const serializedValue = JSON.stringify( value );
        localStorage.setItem( key, serializedValue );
        return true;
    } catch ( error ) {
        console.error( 'Error saving to storage:', error );
        return false;
    }
};

export const loadFromStorage = ( key, defaultValue = null ) => {
    try {
        const item = localStorage.getItem( key );
        if ( item === null ) return defaultValue;

        try {
            return JSON.parse( item );
        } catch ( parseError ) {
            console.error( 'Error parsing storage value:', parseError );
            return defaultValue;
        }
    } catch ( error ) {
        console.error( 'Error loading from storage:', error );
        return defaultValue;
    }
};

export const removeFromStorage = ( key ) => {
    try {
        localStorage.removeItem( key );
        return true;
    } catch ( error ) {
        console.error( 'Error removing from storage:', error );
        return false;
    }
};

export const clearStorage = () => {
    try {
        localStorage.clear();
        return true;
    } catch ( error ) {
        console.error( 'Error clearing storage:', error );
        return false;
    }
};

export const getStorageSize = () => {
    try {
        let total = 0;
        for ( let i = 0; i < localStorage.length; i++ ) {
            const key   = localStorage.key( i );
            const value = localStorage.getItem( key );
            total += key.length + value.length;
        }
        return total;
    } catch ( error ) {
        console.error( 'Error calculating storage size:', error );
        return 0;
    }
};

export const isStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem( test, test );
        localStorage.removeItem( test );
        return true;
    } catch ( error ) {
        return false;
    }
};

// Utility function to handle storage events
export const addStorageListener = ( callback ) => {
    window.addEventListener( 'storage', callback );
    return () => window.removeEventListener( 'storage', callback );
};
