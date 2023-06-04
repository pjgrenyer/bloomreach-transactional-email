# bloomreach-transactional-email 

[![NPM version](https://img.shields.io/npm/v/bloomreach-transactional-email.svg?style=flat-square)](https://www.npmjs.com/package/bloomreach-transactional-email)
[![NPM downloads](https://img.shields.io/npm/dm/bloomreach-transactional-email.svg?style=flat-square)](https://www.npmjs.com/package/bloomreach-transactional-email)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://github.com/prettier/prettier)

A nonofficial, feature complete, client library for sending transactional emails via Bloomreach.

The aim of the `bloomreach-transactional-email` package is to get you going with the Bloomreach Transactional Email API as quickly as possible. The sendEmail function takes the minimum number of required parameters to send an email. Other parameters are optional. Full details of all the options can be found in the [Blooreach Transactional Email API documentation](https://documentation.bloomreach.com/engagement/reference/transactional-email-2).

`bloomreach-transactional-email` uses [axios](https://www.npmjs.com/package/axios), as a peer dependency, to make HTTP calls.

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

## Integrations

You can specify either a single intergation:

```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {        
        integrationId: "5b337eceeb7cdb000d4e20f3"
    } 
);
```
or up to two integrations, a primary and a backup in case the primary fails, with individual sender addresses:
```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {        
        integrations: [
            {
                id: "5b337eceeb7cdb000d4e20f3",
                senderAddress: "marian@exponea.com",
            },
            {
                id: "3f02e4d000bdc7beece733b5",
                senderAddress: "marian@exponea.com",
            }
        ]
    } 
);
```

## Transfer Identity

You can specify a transfer identity of:

- enabled
- disabled
- first_click

```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {        
        transferIdentity: 'disabled'
    } 
);
```

## Attachments

You can add an array of attachments with base64 encoded content:

```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {}, // Options object can also be undefined
    [
        {
            filename: 'example1.txt',
            content: 'RXhhbXBsZSBhdHRhY2htZW50',
            contentType: 'text/plain',
        },
        {
            filename: 'example2.txt',
            content: 'RXhhbXBsZSBhdHRhY2htZW50',
            contentType: 'text/plain',
        },
    ] 
);
```

## Settings

You can also add:

- Custom Event Properties
- Custom Headers
- UrlParams
- Transfer User Identity
- Consent Category
- Consent Category Tracking

Check the  [Blooreach Transactional Email API documentation](https://documentation.bloomreach.com/engagement/reference/transactional-email-2) for details:

```
await sendEmail(
    auth,
    campaignName,
    customerIds,
    htmlContent,
    {}, // Options object can also be undefined
    [], // Attachments array can also be undefined
    {
        customEventProperties: {
            bannana: 'yellow',
            1: 2,
        },
        customHeaders: {
            source: 'your-company',
            1: 2,
        },
        urlParams: {
            source: 'email',
            1: 2,
        },
        transferUserIdentity: 'first_click',
        consentCategory: 'sms',
        consentCategoryTracking: 'sms',
    } 
);
```