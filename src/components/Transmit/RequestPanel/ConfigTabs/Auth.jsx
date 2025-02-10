import React, {useState} from 'react';
import {Form, Row, Col} from 'react-bootstrap';

const Auth = () => {
    const [ auth, setAuth ] = useState( {
        type:   'none',
        basic:  { username: '', password: '' },
        bearer: { token: '' },
        apiKey: { key: '', value: '', in: 'header' }
    } );

    const handleChange = ( type, field, value ) => {
        setAuth( prev => ( {
            ...prev,
            [ type ]: {
                ...prev[ type ],
                [ field ]: value
            }
        } ) );
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Select
                    value={auth.type}
                    onChange={( e ) => setAuth( { ...auth, type: e.target.value } )}
                >
                    <option value="none">No Auth</option>
                    <option value="basic">Basic Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="apiKey">API Key</option>
                </Form.Select>
            </Form.Group>

            {auth.type === 'basic' && (
                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={auth.basic.username}
                                onChange={( e ) => handleChange( 'basic', 'username', e.target.value )}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={auth.basic.password}
                                onChange={( e ) => handleChange( 'basic', 'password', e.target.value )}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            )}

            {auth.type === 'bearer' && (
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Token"
                        value={auth.bearer.token}
                        onChange={( e ) => handleChange( 'bearer', 'token', e.target.value )}
                    />
                </Form.Group>
            )}

            {auth.type === 'apiKey' && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Key"
                            value={auth.apiKey.key}
                            onChange={( e ) => handleChange( 'apiKey', 'key', e.target.value )}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Value"
                            value={auth.apiKey.value}
                            onChange={( e ) => handleChange( 'apiKey', 'value', e.target.value )}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={auth.apiKey.in}
                            onChange={( e ) => handleChange( 'apiKey', 'in', e.target.value )}
                        >
                            <option value="header">Header</option>
                            <option value="query">Query Parameter</option>
                        </Form.Select>
                    </Form.Group>
                </>
            )}
        </Form>
    );
};

export default Auth;
