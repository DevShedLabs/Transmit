// src/components/Transmit/RequestPanel/ConfigTabs/Params.jsx
import React from 'react';

const Params = ( { params, setParams, updateUrlWithParams } ) => {
    const addParam = () => setParams( [ ...params, { key: '', value: '' } ] );

    const handleParamChange = ( index, field, value ) => {
        const newParams             = [ ...params ];
        newParams[ index ][ field ] = value;
        setParams( newParams );
        updateUrlWithParams( newParams );
    };

    return (
        <div className="mb-4">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-2">
                <div className="text-sm text-gray-600">Key</div>
                <div className="text-sm text-gray-600">Value</div>
                <div></div>
                {params.map( ( param, index ) => (
                    <React.Fragment key={index}>
                        <input
                            type="text"
                            value={param.key}
                            onChange={( e ) => handleParamChange( index, 'key', e.target.value )}
                            placeholder="Key"
                            className="px-3 py-2 border rounded"
                        />
                        <input
                            type="text"
                            value={param.value}
                            onChange={( e ) => handleParamChange( index, 'value', e.target.value )}
                            placeholder="Value"
                            className="px-3 py-2 border rounded"
                        />
                        <button
                            onClick={() => {
                                const newParams = params.filter( ( _, i ) => i !== index );
                                setParams( newParams );
                                updateUrlWithParams( newParams );
                            }}
                            className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            ×
                        </button>
                    </React.Fragment>
                ) )}
            </div>
            <button
                onClick={addParam}
                className="mt-2 px-3 py-1 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
            >
                + Add Parameter
            </button>
        </div>
    );
};

export default Params;
