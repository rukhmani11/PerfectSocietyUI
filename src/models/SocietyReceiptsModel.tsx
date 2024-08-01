export interface SocietyReceiptsModel {
    SocietyReceiptId: string;
    SocietyId: string;
    SocietyBuildingUnitId: string;
    SocietyMemberId: string;
    SocietySubscriptionId: string;
    ReceiptDate: Date;
    AcYear: string;
    Serial: number;
    BillAbbreviation: string;
    ReceiptNo: string;
    Amount: number;
    PrincipalAdjusted: number;
    InterestAdjusted: number;
    NonChgAdjusted: number;
    TaxAdjusted: number;
    Advance: number;
    Particulars: string;
    PayModeCode: string;
    PayRefNo: string;
    PayRefDate: Date;
    BankId: string;
    // BankName: string;
    Branch: string;
    AcTransactionId: string;
    IsPrinted: boolean;
}
export interface SocietyReceiptRangeModel {
    SocietyId: string;
    FromDate: Date;
    ToDate: Date;
}
