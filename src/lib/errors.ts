export class BloomreachError extends Error {
    private _status: number;
    private _statusText: string;
    private _response: any;

    constructor(status: number, statusText: string, response: any) {
        super(`${status} - ${statusText} - ${JSON.stringify(response, null, 2)}`);

        this._status = status;
        this._statusText = statusText;
        this._response = response;
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

export class BloomreachContextDeadlineExceeded extends BloomreachBadRequest {
    constructor(status: number, statusText: string, response: any) {
        super(status, statusText, response);
    }
}
