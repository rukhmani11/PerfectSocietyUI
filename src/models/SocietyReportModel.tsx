export interface MemberLedgerReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    SocietyBuildingId: string;
    SocietyBuildingUnitId: string;
    FromDate: Date;
    ToDate: Date;
    IsDetails: boolean;
}

export interface MemberBalanceReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    SocietyBuildingId: string;
    BalanceFilter: string;
    BillAbbreviation: string;
    IsDetails: boolean;
    Amount: number;
}

export interface BillRegisterReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    SocietyBuildingId: string;
    BillAbbreviation: string;
    FromDate: Date;
    ToDate: Date;
    IsDetails: boolean;
    IsAllColumns: boolean;
}

export interface CollectionReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    SocietyBuildingId: string;
    FromDate: Date;
    ToDate: Date;
}

export interface SocietyInvestmentReportModel {
    SocietySubscriptionId: string;
    FromDate: Date;
    ToDate: Date;
    IsPending: boolean;
}

export interface AcTransactionVoucherModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    AcTransactionId: string;
    DocType: string;
    FromDate: Date;
    ToDate: Date;
}

export interface PayInSlipModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    BillAbbreviation: string;
    BankId: string;
    FromDate: Date;
    ToDate: Date;
}

export interface ParkingRegisterReportModel {
    SocietyId: string;
    SocietySubscriptionId: string;
    SocietyBuildingId: string;
    SocietyBuildingUnitId: string;
    SocietyParkingId: string;
    FromDate: Date;
    ToDate: Date;
    Status: string;
}
