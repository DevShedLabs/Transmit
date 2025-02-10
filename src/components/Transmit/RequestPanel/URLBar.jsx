// src/components/Transmit/RequestPanel/URLBar.jsx
import React from 'react';
import { Send, Save } from 'lucide-react';

const URLBar = ({ method, setMethod, url, setUrl, loading, onSend, onSave }) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    return (
        <div className="flex gap-2 mb-4">
            <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border rounded"
            >
                {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter request URL"
                className="flex-1 px-3 py-2 border rounded"
            />
            <button
                onClick={onSend}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send'}
            </button>
            <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
                <Save className="w-4 h-4" />
                Save
            </button>
        </div>
    );
};

export default URLBar;