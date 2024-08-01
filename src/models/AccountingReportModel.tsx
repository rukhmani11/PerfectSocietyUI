export interface AccountingReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    AcHeadIds :string; //comma separated ids //general ledger
    FromDate: Date;
    ToDate: Date;
    DocType: string; //transactionRegister
}

export interface IncomeExpenditureReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    FromDate: Date;
    ToDate: Date;
}

export interface BalanceSheetModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    AsOnDate: Date;
}

export interface BankReconciliationReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    AsOnDate: Date;
    AcHeadId: string;
}