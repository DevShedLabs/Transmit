import React, {useState} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';

const Params = () => {
    const [ params, setParams ] = useState( [ { key: '', value: '' } ] );

    const addParam = () => {
        setParams( [ ...params, { key: '', value: '' } ] );
    };

    const updateParam = ( index, field, value ) => {
        const newParams = [ ...params ];
        if ( !newParams[ index ] ) {
            newParams[ index ] = {};
        }
        newParams[ index ] = {
            ...newParams[ index ],
            [ field ]: value
        };
        setParams( newParams );
    };

    const removeParam = ( index ) => {
        setParams( params.filter( ( _, i ) => i !== index ) );
    };

    return (
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
                {params.map( ( param, index ) => (
                    <Row key={index} className="mb-2">
                        <Col>
                            <Form.Control
                                type="text"
                                value={param?.key || ''}
                                onChange={( e ) => updateParam( index, 'key', e.target.value )}
                                placeholder="Key"
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                type="text"
                                value={param?.value || ''}
                                onChange={( e ) => updateParam( index, 'value', e.target.value )}
                                placeholder="Value"
                            />
                        </Col>
                        <Col xs="auto">
                            <Button
                                variant="danger"
                                onClick={() => removeParam( index )}
                            >
                                ×
                            </Button>
                        </Col>
                    </Row>
                ) )}
            </div>
            <Button
                variant="outline-primary"
                onClick={addParam}
                size="sm"
            >
                + Add Parameter
            </Button>
        </Form>
    );
};

export default Params;
