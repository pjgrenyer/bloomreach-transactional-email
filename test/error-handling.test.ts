import { BloomreachBadRequest, BloomreachError, BloomreachSuppressionList, BloomreachTemplateNotFound, Auth, sendEmail } from '../src';
import nock from 'nock';
import { BloomreachContextDeadlineExceeded, BloomReachRateLimited } from '../src/lib/errors';

describe('error handling', () => {
    const username = 'username';
    const password = 'password';
    const baseUrl = 'https://api.exponea.com';
    const projectToken = 'project-token';

    const campaignName = 'campaign';
    const customerId = { key: 'value' };
    const emailContent = {
        html: '<!DOCTYPEhtml><body>Hello world</body></html>',
        subject: 'SubjectExample',
    };

    describe('config', () => {
        it('should throw if username missing', async () => {
            expect.assertions(1);
            const auth = {} as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Username not set!'));
            }
        });

        it('should throw if password missing', async () => {
            expect.assertions(1);
            const auth = {
                username,
            } as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Password not set!'));
            }
        });

        it('should throw if baseurl missing', async () => {
            expect.assertions(1);
            const auth = {
                username,
                password,
            } as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Base url not set!'));
            }
        });

        it('should throw if project token missing', async () => {
            expect.assertions(1);
            const auth = {
                username,
                password,
                baseUrl,
            } as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Project token not set!'));
            }
        });
    });

    describe('http', () => {
        it('should throw 500 BloomreachError', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl).post(`/email/v2/projects/${projectToken}/sync`).reply(500, 'error!');

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachError);
                expect(error.message).toEqual('500 - null - "error!"');
            }
        });

        it('should throw BloomreachBadRequest', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl).post(`/email/v2/projects/${projectToken}/sync`).reply(400, 'error!');

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachBadRequest);
                expect(error.message).toEqual('400 - null - "error!"');
            }
        });

        it('should throw BloomreachTemplateNotFound', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: {
                        email_content: { template_id: ['The template you have asked for is NOT FOUND!'] },
                    },
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachTemplateNotFound);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: {
                                email_content: {
                                    template_id: ['The template you have asked for is NOT FOUND!'],
                                },
                            },
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachTemplateNotFound - alternative message', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: {
                        email_content: { template_id: ['Failed to use stored template: no such an email design'] },
                    },
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachTemplateNotFound);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: {
                                email_content: {
                                    template_id: ['Failed to use stored template: no such an email design'],
                                },
                            },
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachContextDeadlineExceeded', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: {
                        email_content: {
                            template_id: ['Failed to render the template: content HTML: <method item_by_id of CatalogAccessor object>: context deadline exceeded'],
                        },
                    },
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachContextDeadlineExceeded);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: {
                                email_content: {
                                    template_id: ['Failed to render the template: content HTML: <method item_by_id of CatalogAccessor object>: context deadline exceeded'],
                                },
                            },
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachSuppressionList', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: ['Email address or domain is on the suppression list'],
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachSuppressionList);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: ['Email address or domain is on the suppression list'],
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachSuppressionList - alternative message', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: ['Email address or domain is in the suppression list'],
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachSuppressionList);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: ['Email address or domain is in the suppression list'],
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachBadRequest if errors is not an array', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`)
                .reply(400, {
                    errors: {
                        other_error_type: { message: 'Other ErrorType' },
                    },
                });

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomreachBadRequest);
                expect(error.message).toEqual(
                    `400 - null - ${JSON.stringify(
                        {
                            errors: {
                                other_error_type: { message: 'Other ErrorType' },
                            },
                        },
                        null,
                        2
                    )}`
                );
            }
        });

        it('should throw BloomreachRateLimited on receipt of a 429', async () => {
            expect.assertions(2);

            const auth = {
                username,
                password,
                baseUrl,
                projectToken,
            };

            const headers = {
                'content-type': 'text/html',
                'a-header': 'value',
            };

            nock(baseUrl).post(`/email/v2/projects/${projectToken}/sync`).reply(429, {}, headers);

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toBeInstanceOf(BloomReachRateLimited);
                expect(error.getHeaders()).toMatchObject(headers);
            }
        });
    });
});
