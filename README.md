# bloomreach-transactional-email 
A nonofficial client library for sending transactional emails via Bloomreach.

## Install

```
npm i -save pjgrenyer/bloomreach-transactional-email
```

## Basic Example

```
import { sendEmail } from 'pjgrenyer/bloomreach-transactional-email';

const auth = {
    username: '...',    // APIKeyID
    password: '...',    // APISecret
    baseUrl: 'https://api.exponea.com',
    projectToken: '...',
};

const campaignName = 'MyCampaign';

const customerIds = {
    registered: '3232eroofs23fsdsd'
};

const htmlContent = {
    html: '<!DOCTYPEhtml><body>Hello world</body></html>',
    subject: 'SubjectExample',
}

const email = '...';
const senderName = '...';
const senderAddress = '...';

await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {        
        email,
        senderAddress,
        senderName,
    } // options
);

```

## API Docs
https://documentation.bloomreach.com/engagement/reference/transactional-email-2

