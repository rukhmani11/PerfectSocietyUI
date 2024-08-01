export interface SocietyCommunicationSettingModel {

    SocietyCommunicationSettingId: string;
    SocietyId: string;
    IsCommunicationModuleActive: boolean;
    SmsAndEmailEndsOn: Date;
    AllowToSendSmsAndEmailForGd: boolean;
    IsThirdPartySmsAndEmail: boolean;
    SmsUrl: string;
    EmailSetting: string;
    MaxFileSizeInMb: number;
    IsToReplyAll: boolean;
    IsGroupDiscussionActive: boolean;
}