export interface AppInfoModel {
    Id: string;
    Abbreviation: string;
    Uomid: string;
    Currency: string;
    SubscriptionTaxId: string;
    SubscriptionInvoiceDueDays: number;
    SubscriberTerms: String;
    Flags: string;
    FlagInfo: FlagsModel;
    Mobile: string,
    Email: string,
    Password: string,
    SmssocietyBillDltid: string,
    SmssocietyReceiptDltid: string,
    SmssocietyReceiptReversalDltid: string,
    EmailSocietyBillDltid: string,
    EmailSocietyReceiptDltid: string,
    EmailSocietyReceiptReversalDltid: string,
    SmsloginOtpdltid: string,
    Msg91AuthKey: string,
    Msg91EmailDomain: string,
    Msg91FromEmail: string,
    EaseBuzzKey: string,
    EaseBuzzSalt: string,
    EaseBuzzEnv: string,
    HomePageHtml: string,
    PrivacyPolicyHtml: string,
    TermsConditionsHtml: string
}

export interface FlagsModel {
    GstBill: Boolean;
    PreviousYear: Boolean;
    MonthlyCharge: Boolean;
    MultiLingual: Boolean;
    Dashboard: Boolean;
    UPIPay: Boolean;
    OtherReportExcel: Boolean;
    SSDocsIntegration: Boolean;
}
