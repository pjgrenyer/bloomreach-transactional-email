import axios from 'axios';

export interface Auth {
    username: string;
    password: string;
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

export interface Options {
    language?: string;
    transferIdentity?: 'enabled' | 'disabled' | 'first_click';
}

export const sendEmail = async (
    auth: Auth,
    campaignName: string,
    email: string,
    customerIds: any,
    integrationId: string,
    senderAddress: string,
    senderName: string,
    emailContent: HtmlContent | TemplateContent,
    options?: Options
) => {
    const body = {
        integration_id: integrationId,
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
            sender_address: senderAddress,
            sender_name: senderName,
        },
        campaign_name: campaignName,
        recipient: {
            customer_ids: customerIds,
            email,
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
        const response = await axios.post(`https://bloomreach-api.haven.com/email/v2/projects/${auth.projectToken}/sync`, body, {
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
