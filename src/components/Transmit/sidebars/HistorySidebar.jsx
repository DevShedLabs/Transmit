// src/components/Transmit/sidebars/HistorySidebar.jsx
import React from 'react';
import {formatDistanceToNow} from 'date-fns';

const HistorySidebar = ( { history, onSelect } ) => {
    return (
        <div className="w-80 bg-white border-l">
            <div className="p-4">
                <h2 className="font-semibold mb-4">History</h2>
                <div className="space-y-2">
                    {history.map( item => (
                        <HistoryItem
                            key={item.id}
                            item={item}
                            onClick={() => onSelect( item )}
                        />
                    ) )}
                </div>
            </div>
        </div>
    );
};

const HistoryItem = ( { item, onClick } ) => {
    return (
        <div
            className="p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                    item.response.status < 400 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {item.method}
                </span>
                <span className="text-sm truncate">{item.url}</span>
            </div>
            <div className="text-xs text-gray-500">
                {formatDistanceToNow( new Date( item.response.time ), { addSuffix: true } )}
            </div>
        </div>
    );
};

export default HistorySidebar;
