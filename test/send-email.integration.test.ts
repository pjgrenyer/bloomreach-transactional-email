import { sendEmail } from '../src/send-email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.test.env' });

const { BLOOMREACH_PROJECT_TOKEN, BLOOMREACH_USERNAME, BLOOMREACH_PASSWORD, INTERGRATION_ID, EMAIL, SENDER_EMAIL, SENDER_NAME } = process.env;

describe('send email', () => {
    const auth = {
        username: BLOOMREACH_USERNAME as string,
        password: BLOOMREACH_PASSWORD as string,
        projectToken: BLOOMREACH_PROJECT_TOKEN as string,
    };

    it('should send html email', async () => {
        const response = await sendEmail(
            auth,
            'MyCampaign',
            EMAIL as string,
            {
                HavenID: '3232eroofs23fsdsd',
            },
            SENDER_EMAIL as string,
            SENDER_NAME as string,
            {
                html: '<!DOCTYPEhtml><body>Hello world</body></html>',
                subject: 'SubjectExample',
            },
            {
                integrationId: INTERGRATION_ID as string,
                language: 'en',
                transferIdentity: 'disabled',
            }
        );

        expect(response).toEqual({ message: 'Email was sent successfully.', success: true });
    });

    it('should send template email', async () => {
        const response = await sendEmail(
            auth,
            'Order Confirmation',
            EMAIL as string,
            {
                HavenID: '3232eroofs23fsdsd',
            },
            SENDER_EMAIL as string,
            SENDER_NAME as string,
            {
                templateId: '64653647e1a2f69f105fbd54',
                params: {
                    first_name: 'James',
                    order_number: '123456',
                    billing: {
                        address1: '1 London Road',
                        address2: '',
                        city: 'Gloucester',
                        postcode: 'GL1 1AA',
                    },
                    delivery: {
                        address1: '1 London Road',
                        address2: '',
                        city: 'Gloucester',
                        postcode: 'GL1 1AA',
                    },
                    currency_symbol: '£',
                    order_total: 1198,
                    order_lines: [
                        {
                            image: 'https://images.ctfassets.net/ob1psfsvxnrx/7KFw6N8k1QPbDtJH07puhK/18c84ae56856220fc553e80af4cfb1c7/br_beach_01_2022_rgb_xl.jpg',
                            title: 'Burhnam on Sea',
                            price: 899,
                        },
                        {
                            image: 'https://images.ctfassets.net/ob1psfsvxnrx/3gcFOiUgFSeBmA3v0QTakF/52ec9e7795cf78ad25a358faacc30bf1/cf_lodgeext_04_2022.jpg',
                            title: 'Diamond Lodge',
                            price: 299,
                        },
                    ],
                },
            },
            {
                integrationId: INTERGRATION_ID as string,
            }
        );

        expect(response).toEqual({ message: 'Email was sent successfully.', success: true });
    });
});
