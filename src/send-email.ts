import axios from 'axios';
import { BloomreachBadRequest, BloomreachError, BloomreachSuppressionList, BloomreachTemplateNotFound } from './lib/errors';

export interface Auth {
    username: string;
    password: string;
    baseUrl: string;
    projectToken: string;
}

export interface HtmlContent {
    html: string;
    subject: string;
}

export interface TemplateContent {
    templateId: string;
    params?: any;
}

export interface Integration {
    id: string;
    senderAddress: string;
}

export interface Options {
    integrationId?: string;
    integrations?: Integration[]; // max 2
    email?: string;
    language?: string;
    senderAddress?: string;
    senderName?: string;
    transferIdentity?: 'enabled' | 'disabled' | 'first_click';
}

export interface Attachment {
    filename: string;
    content: string;
    contentType: string;
}

export interface AlphaNumericDictionary {
    [name: string | number]: string | number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomEventProperties extends AlphaNumericDictionary {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomHeaders extends AlphaNumericDictionary {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UrlParams extends AlphaNumericDictionary {}

export interface Settings {
    customEventProperties?: CustomEventProperties;
    customHeaders?: CustomHeaders;
    urlParams?: UrlParams;
    transferUserIdentity?: 'enabled' | 'disabled' | 'first_click';
    consentCategory?: string;
    consentCategoryTracking?: string;
}

export const sendEmail = async (
    auth: Auth,
    campaignName: string,
    customerIds: any,
    emailContent: HtmlContent | TemplateContent,
    options?: Options,
    attachments?: Attachment[],
    settings?: Settings
) => {
    checkConfig(auth);

    const body = {
        integration_id: options?.integrationId,
        integrations: options?.integrations?.map((integration) => ({ id: integration.id, sender_address: integration.senderAddress })),
        email_content: {
            ...('templateId' in emailContent
                ? {
                      template_id: emailContent.templateId,
                      params: emailContent.params,
                  }
                : {
                      html: emailContent.html,
                      subject: emailContent.subject,
                  }),
            sender_address: options?.senderAddress,
            sender_name: options?.senderName,
            attachments: attachments?.map((attachment) => ({ filename: attachment.filename, content: attachment.content, content_type: attachment.contentType })),
        },
        campaign_name: campaignName,
        recipient: {
            customer_ids: customerIds,
            email: options?.email,
            language: options?.language,
        },
        transfer_identity: options?.transferIdentity,
        settings: settings
            ? {
                  custom_event_properties: settings?.customEventProperties,
                  custom_headers: settings?.customHeaders,
                  url_params: settings?.urlParams,
                  transfer_user_identity: settings?.transferUserIdentity,
                  consent_category: settings?.consentCategory,
                  consent_category_tracking: settings?.consentCategoryTracking,
              }
            : undefined,
    };

    try {
        const response = await axios.post(`${auth.baseUrl}/email/v2/projects/${auth.projectToken}/sync`, body, {
            headers: {
                'content-type': 'application/json',
            },
            auth: {
                username: auth.username,
                password: auth.password,
            },
        });

        return response.data;
    } catch (error: any) {
        const statusCode = error.response?.status;
        const statusText = error.response?.statusText;
        const response = error.response?.data ?? error.message;

        if (statusCode === 400) {
            if (response?.errors?.email_content?.template_id?.find((mes: string) => mes.toLocaleLowerCase().includes('not found'))) {
                throw new BloomreachTemplateNotFound(statusCode, statusText, response);
            } else if (response?.errors?.find((mes: string) => mes.toLocaleLowerCase().includes('email address or domain is on the suppression list'))) {
                throw new BloomreachSuppressionList(statusCode, statusText, response);
            }
            throw new BloomreachBadRequest(statusCode, statusText, response);
        }

        throw new BloomreachError(statusCode, statusText, response);
    }
};

const checkConfig = (auth: Auth) => {
    if (!auth.username) {
        throw new Error('Username not set!');
    }

    if (!auth.password) {
        throw new Error('Password not set!');
    }

    if (!auth.baseUrl) {
        throw new Error('Base url not set!');
    }

    if (!auth.projectToken) {
        throw new Error('Project token not set!');
    }
};
