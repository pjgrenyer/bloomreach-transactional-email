import nock from 'nock';
import { sendEmail } from '../src/send-email';

describe('send email', () => {
    const username = 'username';
    const password = 'password';
    const baseUrl = 'https://api.exponea.com';
    const projectToken = 'project-token';

    const email = 'email@example.com';

    const auth = {
        username,
        password,
        baseUrl,
        projectToken,
    };

    const campaignName = 'campaignName';
    const customerIds = {
        registered: email,
    };

    const htmlContent = {
        html: '<h1>Test</h1>',
        subject: 'test subject',
    };

    describe('basic', () => {
        const templateContent = {
            templateId: 'template-id',
            params: { key: 'value' },
        };

        it('minimal html send', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject,
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent);
        });

        it('minimal template send', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        template_id: templateContent.templateId,
                        params: templateContent.params,
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, templateContent);
        });
    });

    describe('integration', () => {
        const integrationId = 'integration-id';
        const integrations = [
            {
                id: 'integration-id1',
                senderAddress: 'from1@example.com',
            },
            {
                id: 'integration-id2',
                senderAddress: 'from2@example.com',
            },
        ];

        it('single integration', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    integration_id: integrationId,
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject,
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { integrationId });
        });

        it('double integration', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    integrations: [
                        {
                            id: integrations[0].id,
                            sender_address: integrations[0].senderAddress,
                        },
                        {
                            id: integrations[1].id,
                            sender_address: integrations[1].senderAddress,
                        },
                    ],
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject,
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { integrations });
        });
    });

    describe('email', () => {
        const senderAddress = 'from@example.com';
        const senderName = 'Bloomreach';

        it('sender', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject,
                        sender_address: senderAddress,
                        sender_name: senderName,
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { senderAddress, senderName });
        });

        it('to', async () => {
            const language = 'en';

            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                        email,
                        language
                    },
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { email, language });
        });
    });

    describe('transfer identity', () => {
        it('enabled', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                    transfer_identity: 'enabled'
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { transferIdentity: 'enabled' });
        });

        it('disabled', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                    transfer_identity: 'disabled'
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { transferIdentity: 'disabled' });
        });

        it('first click', async () => {
            nock(baseUrl)
                .post(`/email/v2/projects/${projectToken}/sync`, {
                    email_content: {
                        html: htmlContent.html,
                        subject: htmlContent.subject
                    },
                    campaign_name: campaignName,
                    recipient: {
                        customer_ids: customerIds,
                    },
                    transfer_identity: 'first_click'
                })
                .reply(200, { message: 'Email was sent successfully.', success: true });

            await sendEmail(auth, campaignName, customerIds, htmlContent, { transferIdentity: 'first_click' });
        });
    });
});
