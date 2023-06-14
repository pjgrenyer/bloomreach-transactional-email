import { BloomreachError } from '../../src/lib/errors';

describe('bloomreach error', () => {
    const statusCode = 500;
    const statusText = 'statusText';
    const response = { key: 'value' };

    it('should get status code', () => {
        const error = new BloomreachError(statusCode, statusText, response);
        expect(error.getStatus()).toEqual(statusCode);
    });

    it('should get status text', () => {
        const error = new BloomreachError(statusCode, statusText, response);
        expect(error.getStatusText()).toEqual(statusText);
    });

    it('should get response', () => {
        const error = new BloomreachError(statusCode, statusText, response);
        expect(error.getResponse()).toEqual(response);
    });

    it('error message should include all elements', () => {
        const error = new BloomreachError(statusCode, statusText, response);
        expect(error.message).toEqual(`500 - statusText - ${JSON.stringify(response, null, 2)}`);
    });
});
