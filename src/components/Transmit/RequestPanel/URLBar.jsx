import React from 'react';
import {Form, Button, InputGroup} from 'react-bootstrap';
import {Send, Save} from 'lucide-react';

const URLBar = ( { method, setMethod, url, setUrl, loading, onSend, onSave } ) => {
    const methods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD' ];

    return (
        <InputGroup className="mb-3">
            <div style={{ width: '120px', flex: '0 0 120px' }}>
                <Form.Select
                    value={method}
                    onChange={( e ) => setMethod( e.target.value )}
                >
                    {methods.map( m => (
                        <option key={m} value={m}>{m}</option>
                    ) )}
                </Form.Select>
            </div>

            <Form.Control
                type="text"
                value={url}
                onChange={( e ) => setUrl( e.target.value )}
                placeholder="Enter request URL"
            />

            <Button
                variant="primary"
                onClick={onSend}
                disabled={loading}
                className="d-flex align-items-center gap-2"
            >
                <Send size={16} />
                {loading ? 'Sending...' : 'Send'}
            </Button>

            <Button
                variant="success"
                onClick={onSave}
                className="d-flex align-items-center gap-2"
            >
                <Save size={16} />
                Save
            </Button>
        </InputGroup>
    );
};

export default URLBar;
