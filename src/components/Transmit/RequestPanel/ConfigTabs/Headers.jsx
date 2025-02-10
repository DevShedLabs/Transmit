import React, {useState} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';

const Headers = () => {
    const [ headers, setHeaders ] = useState( [ { key: '', value: '' } ] );

    const addHeader = () => {
        setHeaders( [ ...headers, { key: '', value: '' } ] );
    };

    const updateHeader = ( index, field, value ) => {
        const newHeaders = [ ...headers ];
        if ( !newHeaders[ index ] ) {
            newHeaders[ index ] = {};
        }
        newHeaders[ index ] = {
            ...newHeaders[ index ],
            [ field ]: value
        };
        setHeaders( newHeaders );
    };

    const removeHeader = ( index ) => {
        setHeaders( headers.filter( ( _, i ) => i !== index ) );
    };

    return (
        <div className="mb-4">
            <Form>
                <div className="mb-2">
                    <Row className="mb-2">
                        <Col>
                            <Form.Label className="text-muted">Key</Form.Label>
                        </Col>
                        <Col>
                            <Form.Label className="text-muted">Value</Form.Label>
                        </Col>
                        <Col xs="auto"></Col>
                    </Row>
                    {headers.map( ( header, index ) => (
                        <Row key={index} className="mb-2">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={header?.key || ''}
                                    onChange={( e ) => updateHeader( index, 'key', e.target.value )}
                                    placeholder="Key"
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={header?.value || ''}
                                    onChange={( e ) => updateHeader( index, 'value', e.target.value )}
                                    placeholder="Value"
                                />
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="danger"
                                    onClick={() => removeHeader( index )}
                                >
                                    ×
                                </Button>
                            </Col>
                        </Row>
                    ) )}
                </div>
                <Button
                    variant="outline-primary"
                    onClick={addHeader}
                    size="sm"
                >
                    + Add Header
                </Button>
            </Form>
        </div>
    );
};

export default Headers;