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
