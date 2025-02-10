import React from 'react';
import {Form, Button, InputGroup, Nav} from 'react-bootstrap';
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

    return (
        <div className="p-3">
            {/* URL Bar */}
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
                />
                <Button
                    variant="primary"
                    onClick={onSend}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send'}
                </Button>
                <Button
                    variant="success"
                    onClick={onSave}
                >
                    Save
                </Button>
            </InputGroup>

            {/* Tabs Navigation */}
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

            {/* Tab Content */}
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