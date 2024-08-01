export interface SocietiesModel {
    SocietyId: string;
    Society: string;
    Abbreviation: string;
    ShortName: string;
    RegistrationNo: string;
    RegistrationDate: Date;
    Address: string;
    City: string;
    Pin: number;
    StateId: string;
    CountryCode: string;
    ContactPerson: string;
    Phone: string;
    Mobile: string;
    Builder: string;
    Architect: string;
    Signatory: string;
    Pan: string;
    Tan: string;
    TaxRegistrationNo: string;
    Capital: number;
    // UNoOfMembers: number;
    Uomid: string;
    AccountPosting: string;
    MemberAcHeadId: string;
    TransferFeeAcHeadId: string;
    UMinDate: Date;
    UMaxDate: Date;
    SubscriberId: string;
    Active: boolean;
    Sms: boolean;
    EmailId: string;
    TaxApplicable: boolean;
    ShowParticularsInReceipt: boolean;
    RazorPayMerchantId: string;
    RazorPayTestApikeyId: string;
    RazorPayTestKeySecret: string;
    RazorPayLiveapikeyId: string;
    RazorPayLivekeySecret: string;
    EnableSms: boolean;
    EnableEmail: boolean;
    EnablePaymentGateway: boolean;
    EnableSsdocsIntegration: boolean;
    QrcodeImageName: string;
    Upipay: string;
    EaseBuzzSubMerchantId: string;
    EnableMultilingual: boolean;
}

export interface SocietyParameterModel {
    SocietyId: string;
    AccountPosting: string;
    MemberAcHeadId: string;
    TaxApplicable: boolean;
}
