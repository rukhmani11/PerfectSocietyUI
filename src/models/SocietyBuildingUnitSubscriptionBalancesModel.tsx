export interface SocietyBuildingUnitSubscriptionBalancesModel {

    SocietyBuildingUnitSubscriptionBalanceId: string;
    SocietyBuildingUnitId: string;
    SocietySubscriptionId: string;
    BillAbbreviation: string;
    PrincipalAmount: number;
    InterestAmount: number;
    PrincipalReceipt: number;
    InterestReceipt: number;
    SpecialBillAmount: number;
    SpecialBillReceipt: number;
    TaxAmount: number;
    TaxReceipt: number;
    Advance: number;
    SocietyMemberId: string;
    AdvanceAdjusted: number;
}