import { AxiosError, RawAxiosResponseHeaders, AxiosHeaders } from 'axios';

export class BloomreachError extends AxiosError {
    private readonly _message: string;

    constructor(error: AxiosError) {
        super(error.message, error.code, error.config, error.request, error.response);
        const statusCode = error.response?.status;
        const statusText = error.response?.statusText;
        const response = error.response?.data ?? error.message;
        this._message = `${statusCode} - ${statusText} - ${JSON.stringify(response, null, 2)}`;
    }

    getStatus() {
        return this.response?.status;
    }

    getStatusText() {
        return this.response?.statusText;
    }

    getResponse() {
        return this.response?.data ?? this.message;
    }

    getHeaders(): RawAxiosResponseHeaders | (RawAxiosResponseHeaders & AxiosHeaders) | undefined {
        return this.response?.headers;
    }

    // Expose the old message that was built for these errors.
    getCombinedMessage() {
        return this._message;
    }
}

export class BloomreachBadRequest extends BloomreachError {
    constructor(error: AxiosError) {
        super(error);
    }
}

export class BloomreachTemplateNotFound extends BloomreachBadRequest {
    constructor(error: AxiosError) {
        super(error);
    }
}

export class BloomreachSuppressionList extends BloomreachBadRequest {
    constructor(error: AxiosError) {
        super(error);
    }
}

export class BloomReachRateLimited extends BloomreachError {
    constructor(error: AxiosError) {
        super(error);
    }
}
