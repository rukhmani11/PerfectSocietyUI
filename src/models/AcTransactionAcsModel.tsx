export interface AcTransactionAcsModel{
    AcTransactionAcId:string;
    AcTransactionId:string;
    SocietyId:string;
    AcHeadId:string;
    Nature:string;
    DrCr:string;
    Amount:number;
    Particulars:string;
    Reconciled: Date;
    DocType:string
}


export interface BankReconciliationSearchModel
{
    SocietyId: string;
    SocietySubscriptionId: string;
    AcHeadId: string;
    FromDate:Date;
    ToDate:Date;
    DrCr:string;
    ReconciledOn: Date;
    UpdateOnlyBlank: boolean;
}