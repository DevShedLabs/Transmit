import React from 'react';
import {Container} from 'react-bootstrap';
import Transmit from './components/Transmit';
import {NotificationProvider} from './components/Transmit/context/NotificationContext';

function App() {
    return (
        <NotificationProvider>
            <Container fluid className="h-screen p-0">
                <Transmit />
            </Container>
        </NotificationProvider>
    );
}

export default App;