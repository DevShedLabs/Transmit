import React, {useState} from 'react';
import {Form} from 'react-bootstrap';

const Settings = () => {
    const [ settings, setSettings ] = useState( {
        timeout:         30000,
        followRedirects: true,
        sslVerification: true
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
                <Form.Label>Request Timeout (ms)</Form.Label>
                <Form.Control
                    type="number"
                    value={settings.timeout}
                    onChange={( e ) => handleChange( 'timeout', parseInt( e.target.value ) )}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Follow Redirects</Form.Label>
                <Form.Select
                    value={settings.followRedirects.toString()}
                    onChange={( e ) => handleChange( 'followRedirects', e.target.value === 'true' )}
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>SSL Verification</Form.Label>
                <Form.Select
                    value={settings.sslVerification.toString()}
                    onChange={( e ) => handleChange( 'sslVerification', e.target.value === 'true' )}
                >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </Form.Select>
            </Form.Group>
        </Form>
    );
};

export default Settings;
