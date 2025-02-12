// src/components/Transmit/hooks/useStorage.js

import {useState, useEffect, useCallback} from 'react';
import {storageManager, StorageEvents} from '../utils/storageManager';

export const useStorage = () => {
    const [ collections, setCollections ] = useState( () => storageManager.getCollections() );
    const [ history, setHistory ]         = useState( () => storageManager.getHistory() );
    const [ workspace, setWorkspace ]     = useState( () => storageManager.getWorkspaceState() );
    const [ settings, setSettings ]       = useState( () => storageManager.getSettings() );

    // Subscribe to storage changes
    useEffect( () => {
        const unsubscribeCollections = storageManager.subscribe(
            StorageEvents.COLLECTIONS,
            setCollections
        );
        const unsubscribeHistory     = storageManager.subscribe(
            StorageEvents.HISTORY,
            setHistory
        );
        const unsubscribeWorkspace   = storageManager.subscribe(
            StorageEvents.WORKSPACE,
            setWorkspace
        );
        const unsubscribeSettings    = storageManager.subscribe(
            StorageEvents.SETTINGS,
            setSettings
        );

        return () => {
            unsubscribeCollections();
            unsubscribeHistory();
            unsubscribeWorkspace();
            unsubscribeSettings();
        };
    }, [] );

    // Collection management
    const saveCollection = useCallback( ( collection ) => {
        return storageManager.saveCollection( collection );
    }, [] );

    const deleteCollection = useCallback( ( collectionId ) => {
        storageManager.deleteCollection( collectionId );
    }, [] );

    // History management
    const addHistoryItem = useCallback( ( request, response ) => {
        return storageManager.addHistoryItem( request, response );
    }, [] );

    const clearHistory = useCallback( () => {
        storageManager.clearHistory();
    }, [] );

    // Workspace management
    const saveWorkspaceState = useCallback( ( state ) => {
        storageManager.saveWorkspaceState( state );
    }, [] );

    // Settings management
    const updateSettings = useCallback( ( newSettings ) => {
        storageManager.updateSettings( newSettings );
    }, [] );

    // Export/Import functionality
    const exportData = useCallback( () => {
        return storageManager.exportData();
    }, [] );

    const importData = useCallback( ( data ) => {
        return storageManager.importData( data );
    }, [] );

    return {
        // State
        collections,
        history,
        workspace,
        settings,

        // Collection actions
        saveCollection,
        deleteCollection,

        // History actions
        addHistoryItem,
        clearHistory,

        // Workspace actions
        saveWorkspaceState,

        // Settings actions
        updateSettings,

        // Import/Export
        exportData,
        importData
    };
};
