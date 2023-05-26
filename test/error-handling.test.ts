import { Auth, sendEmail } from '../src/send-email';
import nock from 'nock';

const { BLOOMREACH_PROJECT_TOKEN, BLOOMREACH_USERNAME, BLOOMREACH_PASSWORD, BLOOMREACH_BASEURL } = process.env;

const campaignName = 'campaign';
const customerId = { key: 'value' };
const emailContent = {
    html: '<!DOCTYPEhtml><body>Hello world</body></html>',
    subject: 'SubjectExample',
};

describe('error handling', () => {
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
                username: BLOOMREACH_USERNAME as string,
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
                username: BLOOMREACH_USERNAME as string,
                password: BLOOMREACH_PASSWORD as string,
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
                username: BLOOMREACH_USERNAME as string,
                password: BLOOMREACH_PASSWORD as string,
                baseUrl: BLOOMREACH_BASEURL as string,
            } as Auth;

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error).toEqual(new Error('Project token not set!'));
            }
        });
    });

    describe('http', () => {
        it('should throw http error', async () => {
            expect.assertions(1);

            const auth = {
                username: BLOOMREACH_USERNAME as string,
                password: BLOOMREACH_PASSWORD as string,
                baseUrl: BLOOMREACH_BASEURL as string,
                projectToken: BLOOMREACH_PROJECT_TOKEN as string,
            };

            nock('http://baseurl').post('/email/v2/projects/project-token/sync').reply(500, 'error!');

            try {
                await sendEmail(auth, campaignName, customerId, emailContent);
            } catch (error: any) {
                expect(error.message).toEqual(expect.stringContaining('Request failed with status code 500'));
            }
        });
    });
});
