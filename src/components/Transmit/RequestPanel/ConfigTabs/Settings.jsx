// src/components/Transmit/RequestPanel/ConfigTabs/Settings.jsx
import React, {useState} from 'react';
import {Form} from 'react-bootstrap';

const Settings = () => {
    const [ settings, setSettings ] = useState( {
        timeout:              30000,
        followRedirects:      true,
        sslVerification:      true,
        followOriginalMethod: false,
        httpVersion:          'HTTP/1.1'
    } );

    const handleChange = ( field, value ) => {
        setSettings( prev => ( {
            ...prev,
            [ field ]: value
        } ) );
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>HTTP Version</Form.Label>
                <Form.Select
                    value={settings.httpVersion}
                    onChange={( e ) => handleChange( 'httpVersion', e.target.value )}
                >
                    <option value="HTTP/1.0">HTTP/1.0</option>
                    <option value="HTTP/1.1">HTTP/1.1</option>
                    <option value="HTTP/2.0">HTTP/2.0</option>
                </Form.Select>
                <Form.Text className="text-muted">
                    Select the HTTP version to use for sending the request.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Enable SSL certificate verification</Form.Label>
                <Form.Select
                    value={settings.sslVerification.toString()}
                    onChange={( e ) => handleChange( 'sslVerification', e.target.value === 'true' )}
                >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </Form.Select>
                <Form.Text className="text-muted">
                    Verify SSL certificates when sending a request. Verification failures will result in the request
                    being aborted.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Automatically follow redirects</Form.Label>
                <Form.Select
                    value={settings.followRedirects.toString()}
                    onChange={( e ) => handleChange( 'followRedirects', e.target.value === 'true' )}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
                <Form.Text className="text-muted">
                    Follow HTTP 3xx responses as redirects.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Follow original HTTP Method</Form.Label>
                <Form.Select
                    value={settings.followOriginalMethod.toString()}
                    onChange={( e ) => handleChange( 'followOriginalMethod', e.target.value === 'true' )}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Request Timeout (ms)</Form.Label>
                <Form.Control
                    type="number"
                    value={settings.timeout}
                    onChange={( e ) => handleChange( 'timeout', parseInt( e.target.value ) )}
                />
            </Form.Group>
        </Form>
    );
};

export default Settings;
