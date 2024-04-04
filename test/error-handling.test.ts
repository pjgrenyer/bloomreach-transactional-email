import { BloomreachBadRequest, BloomreachError, BloomreachSuppressionList, BloomreachTemplateNotFound } from '../src/lib/errors';
import { Auth, sendEmail } from '../src/send-email';
import nock from 'nock';

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
        it('should thow if username missing', async () => {
            expect.assertions(1);
            const auth = {} as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Username not set!'));
            }
        });

        it('should thow if password missing', async () => {
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

        it('should thow if baseurl missing', async () => {
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

        it('should thow if project token missing', async () => {
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

        it('should throw BloomreachTemplateNotFound - alternitive message', async () => {
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
    });
});
