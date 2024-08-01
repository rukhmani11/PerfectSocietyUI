export interface SocietyReceiptOnholdsModel {
    SocietyReceiptOnholdId: string;
    SocietyId: string;
    SocietyBuildingUnitId: string;
    SocietyMemberId: string;
    SocietySubscriptionId: string;
    ReceiptDate: Date;
    BillAbbreviation: string;
    Amount: number;
    TransactionId: string;
    PaidByPg: string;
    IsReceiptCreated: boolean;
    ReceiptCreatedOn: Date;
}