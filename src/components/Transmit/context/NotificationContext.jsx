// src/components/Transmit/context/NotificationContext.jsx
import React, {createContext, useContext, useState, useCallback, useRef} from 'react';
import {Toast} from 'react-bootstrap';
import {X} from 'lucide-react';

const NotificationContext = createContext( {} );

const NotificationItem = ( { notification, onClose } ) => {
    const bgClass = {
        info:    'bg-primary text-white',
        success: 'bg-success text-white',
        error:   'bg-danger text-white',
        warning: 'bg-warning'
    }[ notification.type ] || 'bg-primary text-white';

    return (
        <Toast onClose={() => onClose( notification.id )} className={bgClass}>
            <Toast.Header closeButton={false}>
                <strong className="me-auto">
                    {notification.type.charAt( 0 ).toUpperCase() + notification.type.slice( 1 )}
                </strong>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => onClose( notification.id )}
                />
            </Toast.Header>
            <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
    );
};

export const NotificationProvider = ( { children } ) => {
    const [ notifications, setNotifications ] = useState( [] );
    const notificationIdCounter               = useRef( 0 );

    const addNotification = useCallback( ( notification ) => {
        const id = `notification-${Date.now()}-${notificationIdCounter.current++}`;
        setNotifications( current => [ ...current, { ...notification, id } ] );

        // Auto-dismiss after timeout unless it's an error
        if ( notification.type !== 'error' ) {
            setTimeout( () => {
                removeNotification( id );
            }, notification.duration || 3000 );
        }

        return id;
    }, [] );

    const removeNotification = useCallback( ( id ) => {
        setNotifications( current => current.filter( notification => notification.id !== id ) );
    }, [] );

    const notify = useCallback( ( message, type = 'info' ) => {
        return addNotification( { message, type } );
    }, [ addNotification ] );

    return (
        <NotificationContext.Provider value={{ notify, removeNotification }}>
            {children}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
                {notifications.map( ( notification ) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                    />
                ) )}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext( NotificationContext );
    if ( !context ) {
        throw new Error( 'useNotification must be used within a NotificationProvider' );
    }
    return context;
};
