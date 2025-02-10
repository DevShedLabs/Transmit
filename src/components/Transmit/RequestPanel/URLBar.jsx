// src/components/Transmit/RequestPanel/URLBar.jsx
import React from 'react';
import {Form, Button, InputGroup} from 'react-bootstrap';
import {Send, Save} from 'lucide-react';

const URLBar = ( { method, setMethod, url, setUrl, loading, onSend, onSave } ) => {
    const methods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD' ];

    const handleSubmit = ( e ) => {
        e.preventDefault();
        if ( typeof onSend === 'function' ) {
            onSend();
        }
    };

    const handleSave = ( e ) => {
        e.preventDefault();
        if ( typeof onSave === 'function' ) {
            onSave();
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
                <Form.Select
                    value={method}
                    onChange={( e ) => setMethod( e.target.value )}
                    style={{ width: '120px' }}
                >
                    {methods.map( m => (
                        <option key={m} value={m}>{m}</option>
                    ) )}
                </Form.Select>
                <Form.Control
                    type="text"
                    value={url}
                    onChange={( e ) => setUrl( e.target.value )}
                    placeholder="Enter request URL"
                />
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                >
                    <Send size={16} />
                    {loading ? 'Sending...' : 'Send'}
                </Button>
                <Button
                    type="button"
                    variant="success"
                    onClick={handleSave}
                    className="d-flex align-items-center gap-2"
                >
                    <Save size={16} />
                    Save
                </Button>
            </InputGroup>
        </Form>
    );
};

export default URLBar;
