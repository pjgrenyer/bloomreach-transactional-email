import { AxiosError, RawAxiosResponseHeaders, AxiosHeaders } from 'axios';

export class BloomreachError extends AxiosError {
    constructor(error: AxiosError) {
        super(buildMessage(error), error.code, error.config, error.request, error.response);
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

    // @deprecated, use this.message.
    getCombinedMessage() {
        return this.message;
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

export class BloomreachContextDeadlineExceeded extends BloomreachError {
    constructor(error: AxiosError) {
        super(error);
    }
}

const buildMessage = (error: AxiosError) => {
    const statusCode = error.response?.status;
    const statusText = error.response?.statusText;
    const response = error.response?.data ?? error.message;
    return `${statusCode} - ${statusText} - ${JSON.stringify(response, null, 2)}`;
};
