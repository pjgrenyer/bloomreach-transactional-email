import axios from 'axios';

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
    // TODO: Settings
    // TODO: Attachments
}

export const sendEmail = async (auth: Auth, campaignName: string, customerIds: any, emailContent: HtmlContent | TemplateContent, options?: Options) => {
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
        },
        campaign_name: campaignName,
        recipient: {
            customer_ids: customerIds,
            email: options?.email,
            language: options?.language,
        },
        transfer_identity: options?.transferIdentity,
        // settings: {
        //     custom_event_properties: {
        //         banana: 'yellow',
        //     },
        // },
    };

    try {
        const response = await axios.post(`${auth.baseUrl}/email/v2/projects/${auth.projectToken}/sync`, body, {
            auth: {
                username: auth.username,
                password: auth.password,
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(JSON.stringify(error?.response.data, null, 2));
    }
};
