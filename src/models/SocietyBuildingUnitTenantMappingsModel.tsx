export interface SocietyBuildingUnitTenantMappingsModel {

    SocietyBuildingUnitTenantMappingId: string;
    SocietyBuildingUnitId: string;
    SocietyMemberTenantId: string;
    PossessionStartDate: Date;
    PossessionEndDate: Date;
    Remarks: string;
    OccupancyFee: number;
    PaymentDetails: string;
    AcHeadId: string;
    Particulars: string;
    PayModeCode: string;
    PayRefNo: string;
    PayRefDate: Date;
    BankId: string;
    Branch: string;
    ActionStatus: string;
    ActionTakenById: string;
    ActionTakenByName: string;
    ActionTakenOn: Date;
}