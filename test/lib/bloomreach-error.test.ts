import { BloomreachError } from '../../src';
import { AxiosError, AxiosResponse } from "axios";

describe('bloomreach error', () => {
    const response: AxiosResponse = {
        data: { key: 'value' },
        status: 500,
        statusText: 'statusText',
        headers: {
            'content-type': 'text/html',
            'x-random-header': 'set',
        },
        config: undefined
    }

    const axiosError = new AxiosError('axiosError', undefined, undefined, undefined, response)

    it('should get status code', () => {
        const error = new BloomreachError(axiosError);
        expect(error.getStatus()).toEqual(response.status);
    });

    it('should get status text', () => {
        const error = new BloomreachError(axiosError);
        expect(error.getStatusText()).toEqual(response.statusText);
    });

    it('should get response', () => {
        const error = new BloomreachError(axiosError);
        expect(error.getResponse()).toEqual(response.data);
    });

    it('should build a combined message including all relevant elements', () => {
        const error = new BloomreachError(axiosError);
        expect(error.getCombinedMessage()).toEqual(`500 - statusText - ${JSON.stringify(response.data, null, 2)}`);
    });

    it('should get headers', () => {
        const error = new BloomreachError(axiosError);
        expect(error.getHeaders()).toEqual(response.headers);
    });
});
