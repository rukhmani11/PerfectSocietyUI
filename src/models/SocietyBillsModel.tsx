export interface SocietyBillsModel {
    SocietyBillId: string;
    SocietyId: string;
    SocietyBuildingUnitId: string;
    SocietyMemberId: string;
    SocietySubscriptionId: string;
    BillAbbreviation: string;
    AcYear: string;
    Serial: number;
    BillNo: string;
    BillDate: Date;
    UAmount: number;
    ChgAmount: number;
    NonChgAmount: number;
    Arrears: number;
    InterestArrears: number;
    NonChgArrears: number;
    TaxArrears: number;
    Advance: number;
    Interest: number;
    Tax: string;
    TaxAmount: number;
    PrincipalAdjusted: number;
    InterestAdjusted: number;
    NonChgAdjusted: number;
    TaxAdjusted: number;
    Payable: number;
    Particulars: string;
    AcTransactionId: string;
    DueDate: Date;
    BillEndDate: Date;
    JiotraceId: number;
    JiosentDate: Date;
}

export interface SocietyBillGenerateModel {
    SocietyId:string;
    SocietySubscriptionId: string;
    BillAbbreviation: string;
}