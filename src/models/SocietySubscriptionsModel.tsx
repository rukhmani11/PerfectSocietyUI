export interface SocietySubscriptionsModel {
    SocietySubscriptionId: string;
    SocietyId: string;
    SubscriptionStart: Date;
    SubscriptionEnd: Date;
    NoOfMembers: number;
    NoOfInvoicedMembers: number;
    NoOfAdditionalMembers: number;
    InvoicedMonths: number;
    SubscribedMonths: number;
    PaidTillDate: Date;
    PaidMonths: number;
    Closed: boolean;
    LockedTillDate : Date;
}