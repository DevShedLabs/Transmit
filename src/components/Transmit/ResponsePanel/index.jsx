// src/components/Transmit/ResponsePanel/index.jsx
import React from 'react';
import {Code, Eye, FileJson, Copy, Download} from 'lucide-react';
import ResponseHeaders from './ResponseHeaders';
import ResponseBody from './ResponseBody';

const ResponsePanel = ( {
                            response,
                            responseView,
                            setResponseView,
                            onCopy,
                            onDownload
                        } ) => {
    if ( !response ) return null;

    return (
        <div className="p-4">
            <div className="bg-white rounded shadow">
                {/* Status and Controls */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                            response.status < 400 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            Status: {response.status}
                        </span>
                        <span className="text-sm text-gray-600">
                            Time: {new Date( response.time ).toLocaleTimeString()}
                        </span>
                        <div className="flex-1" />
                        <button onClick={onCopy} className="p-2 hover:bg-gray-100 rounded">
                            <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={onDownload} className="p-2 hover:bg-gray-100 rounded">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* View Controls */}
                <div className="border-b">
                    <div className="flex gap-4 px-4">
                        <ViewButton
                            active={responseView === 'pretty'}
                            onClick={() => setResponseView( 'pretty' )}
                            icon={<Code className="w-4 h-4" />}
                            label="Pretty"
                        />
                        <ViewButton
                            active={responseView === 'raw'}
                            onClick={() => setResponseView( 'raw' )}
                            icon={<FileJson className="w-4 h-4" />}
                            label="Raw"
                        />
                        <ViewButton
                            active={responseView === 'preview'}
                            onClick={() => setResponseView( 'preview' )}
                            icon={<Eye className="w-4 h-4" />}
                            label="Preview"
                        />
                    </div>
                </div>

                {/* Response Content */}
                <div className="divide-y">
                    <ResponseHeaders headers={response.headers} />
                    <ResponseBody
                        data={response.data}
                        view={responseView}
                    />
                </div>
            </div>
        </div>
    );
};

const ViewButton = ( { active, onClick, icon, label } ) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 flex items-center gap-2 ${
            active ? 'border-b-2 border-blue-500' : ''
        }`}
    >
        {icon}
        {label}
    </button>
);

export default ResponsePanel;
