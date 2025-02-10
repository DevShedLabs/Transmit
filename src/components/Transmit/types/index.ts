// src/components/Transmit/types/index.ts
export interface Request {
    id: string;
    name: string;
    method: string;
    url: string;
    headers: Header[];
    params: Param[];
    body?: string;
    bodyType?: 'raw' | 'form-data' | 'x-www-form-urlencoded';
    bodyFormat?: 'json' | 'text' | 'xml';
    auth?: Auth;
}

export interface Header {
    key: string;
    value: string;
}

export interface Param {
    key: string;
    value: string;
}

export interface Auth {
    type: 'none' | 'basic' | 'bearer' | 'apiKey';
    basic?: {
        username: string;
        password: string;
    };
    bearer?: {
        token: string;
    };
    apiKey?: {
        key: string;
        value: string;
        in: 'header' | 'query';
    };
}

export interface Collection {
    id: string;
    name: string;
    items: Request[];
}

export interface Environment {
    id: string;
    name: string;
    variables: Record<string, string>;
}

export interface Response {
    status: number;
    headers: Record<string, string>;
    data: any;
    time: string;
}

export interface HistoryItem {
    id: string;
    request: Request;
    response: Response;
    timestamp: string;
}