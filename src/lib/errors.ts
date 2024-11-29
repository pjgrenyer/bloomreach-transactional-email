import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export class BloomreachError extends Error {
    private readonly _status: number;
    private readonly _statusText: string;
    private readonly _response: any;
    private readonly _headers: any;

    constructor(status: number, statusText: string, response: any, headers?: RawAxiosResponseHeaders | AxiosResponseHeaders) {
        super(`${status} - ${statusText} - ${JSON.stringify(response, null, 2)}`);

        this._status = status;
        this._statusText = statusText;
        this._response = response;
        this._headers = headers
    }

    getStatus() {
        return this._status;
    }

    getStatusText() {
        return this._statusText;
    }

    getResponse() {
        return this._response;
    }

    getHeaders() {
        return this._headers;
    }
}

export class BloomreachBadRequest extends BloomreachError {
    constructor(status: number, statusText: string, response: any) {
        super(status, statusText, response);
    }
}

export class BloomreachTemplateNotFound extends BloomreachBadRequest {
    constructor(status: number, statusText: string, response: any) {
        super(status, statusText, response);
    }
}

export class BloomreachSuppressionList extends BloomreachBadRequest {
    constructor(status: number, statusText: string, response: any) {
        super(status, statusText, response);
    }
}
