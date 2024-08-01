export interface SocietyCollectionReversalsModel {

    SocietyCollectionReversalId: string;
    SocietyReceiptId: string;
    SocietyId: string;
    SocietyBuildingUnitId: string;
    SocietyMemberId: string;
    SocietySubscriptionId: string;
    ReversalDate: Date;
    AcYear: string;
    Serial: number;
    BillAbbreviation: string;
    DocNo: string;
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
    Branch: string;
    AcTransactionId: string;
}