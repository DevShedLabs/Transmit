// src/components/Transmit/RequestPanel/RequestPanel.jsx
import React from 'react';
import {Form, Button, InputGroup, Nav} from 'react-bootstrap';
import {Send, Save} from 'lucide-react';
import ConfigTabs from './ConfigTabs';

const RequestPanel = ( {
                           method,
                           setMethod,
                           url,
                           setUrl,
                           loading,
                           activeConfigTab,
                           setActiveConfigTab,
                           onSend,
                           onSave
                       } ) => {
    const methods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD' ];

    const handleSubmit = ( e ) => {
        e.preventDefault();
        onSend();
    };

    return (
        <div className="p-3">
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <Form.Select
                        value={method}
                        onChange={( e ) => setMethod( e.target.value )}
                        style={{ width: 'auto' }}
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
                        required
                    />
                    <Button
                        variant="primary"
                        onClick={onSend}
                        disabled={loading || !url}
                    >
                        <Send size={16} className="me-2" />
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                    <Button
                        variant="success"
                        onClick={onSave}
                    >
                        <Save size={16} className="me-2" />
                        Save
                    </Button>
                </InputGroup>
            </Form>

            <Nav variant="tabs" className="mb-3">
                {[ 'Headers', 'Params', 'Body', 'Auth', 'Settings' ].map( tab => (
                    <Nav.Item key={tab}>
                        <Nav.Link
                            active={activeConfigTab === tab.toLowerCase()}
                            onClick={() => setActiveConfigTab( tab.toLowerCase() )}
                        >
                            {tab}
                        </Nav.Link>
                    </Nav.Item>
                ) )}
            </Nav>

            <div className="tab-content p-3 border border-top-0 rounded-bottom">
                <ConfigTabs
                    activeTab={activeConfigTab}
                    onTabChange={setActiveConfigTab}
                />
            </div>
        </div>
    );
};

export default RequestPanel;
