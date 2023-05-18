import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const { BLOOMREACH_PROJECT_TOKEN, BLOOMREACH_USERNAME, BLOOMREACH_PASSWORD } = process.env;

describe('send email', () => {
    it('should send email', async () => {
        const body = {
            integration_id: '646355a20a04b7eba079a157',
            email_content: {
                html: '<!DOCTYPEhtml><body>Hello world</body></html>',
                subject: 'SubjectExample',
                sender_address: 'marian@exponea.com',
                sender_name: 'Marian',
            },
            campaign_name: 'MyCampaign',
            recipient: {
                customer_ids: {
                    HavenID: '3232eroofs23fsdsd',
                },
                email: 'paul.grenyer@gmail.com',
                language: 'en',
            },
            settings: {
                custom_event_properties: {
                    banana: 'yellow',
                },
            },
            transfer_identity: 'enabled',
        };

        const response = axios.post(`https://bloomreach-api.haven.com/email/v2/projects/${BLOOMREACH_PROJECT_TOKEN}/sync`, body, {
            auth: {
                username: BLOOMREACH_USERNAME,
                password: BLOOMREACH_PASSWORD,
            },
        });

        //console.log((await response).data);
    });
});
