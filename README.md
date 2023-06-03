# bloomreach-transactional-email 

[![NPM version](https://img.shields.io/npm/v/bloomreach-transactional-email.svg?style=flat-square)](https://www.npmjs.com/package/bloomreach-transactional-email)
[![NPM downloads](https://img.shields.io/npm/dm/bloomreach-transactional-email.svg?style=flat-square)](https://www.npmjs.com/package/bloomreach-transactional-email)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://github.com/prettier/prettier)

A nonofficial, feature complete, client library for sending transactional emails via Bloomreach.

The aim of `bloomreach-transactional-email` package is to get you going with the Bloomreach Transactional Email API as quickly as possible. The sendEmail function takes the minimum number of required parameters to send an email. Other parameters are optional. Full details of all the options can be found in the [Blooreach Transactional Email API documentation](https://documentation.bloomreach.com/engagement/reference/transactional-email-2).



## Install

```
npm i -save bloomreach-transactional-email
```

## Basic Examples

If you have Customer IDs and a default email integration with a sender name and address setup in Bloomreach then you can use the minimum configuration to send an email by specifying a HTML body and a subject:

```
import { sendEmail } from 'bloomreach-transactional-email';

const auth = {
    username: '...',    // Your APIKeyID
    password: '...',    // Your APISecret
    baseUrl: 'https://api.exponea.com', // Your base url
    projectToken: '...', // Your project token
};

const campaignName = 'MyCampaign';

const customerIds = {
    registered: 'marian@exponea.com'
};

const htmlContent = {
    html: '<!DOCTYPEhtml><body>Hello world</body></html>',
    subject: 'SubjectExample',
}

await sendEmail(auth, campaignName, customerIds, htmlContent);

```
If you have a template set up you can also send an email using it:

```
const templateContent = {
    templateId: '60758e2d18883e1048b817a8',
    params: { first_name: 'Marian' }
}

await sendEmail(auth, campaignName, customerIds, templateContent);

```
If you don’t have Customer IDs setup in Bloomreach you can specify the email address to send the email to (you still need to specify Customer IDs). If you have language variants of your template, you can specify the language. You can also specify the sender name and sender address:

```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {        
        email: 'jon.doe@example.com',
        language: 'en',
        senderAddress: 'Marian',
        senderName: 'marian@exponea.com'
    } 
);
```

