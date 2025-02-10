import React, {useState} from 'react';
import {Form, Row, Col} from 'react-bootstrap';

const Body = ( { method } ) => {
    const [ body, setBody ]             = useState( '' );
    const [ bodyType, setBodyType ]     = useState( 'raw' );
    const [ bodyFormat, setBodyFormat ] = useState( 'json' );

    if ( method === 'GET' ) return null;

    return (
        <Form>
            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Select
                        value={bodyType}
                        onChange={( e ) => setBodyType( e.target.value )}
                        size="sm"
                    >
                        <option value="raw">raw</option>
                        <option value="form-data">form-data</option>
                        <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
                    </Form.Select>
                </Col>

                {bodyType === 'raw' && (
                    <Col xs="auto">
                        <Form.Select
                            value={bodyFormat}
                            onChange={( e ) => setBodyFormat( e.target.value )}
                            size="sm"
                        >
                            <option value="json">JSON</option>
                            <option value="text">Text</option>
                            <option value="xml">XML</option>
                        </Form.Select>
                    </Col>
                )}
            </Row>

            <Form.Group>
                <Form.Control
                    as="textarea"
                    value={body}
                    onChange={( e ) => setBody( e.target.value )}
                    style={{
                        height:     '200px',
                        fontFamily: 'monospace',
                        fontSize:   '14px'
                    }}
                    placeholder={bodyFormat === 'json' ?
                                 '{\n  "key": "value"\n}' :
                                 'Enter request body'}
                />
            </Form.Group>
        </Form>
    );
};

export default Body;
