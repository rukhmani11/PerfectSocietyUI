export interface SocietyBuildingUnitImportsModel {
    SocietyBuildingUnitImportId: string;
    SocietyBuildingId: string;
    Unit: string;
    UnitType:string;
    UnitTypeId: string;
    FloorNo: number;
    Wing: string;
    CarpetArea: number;
    ChargeableArea: number;
    TerraceArea: number;
    StartDate: Date;
    EndDate: Date;
    CertificateNo: string;
    IssueDate: Date;
    NoOfShares: number;
    DistinctiveFrom: number;
    DistinctiveTo: number;
    Value: number;
    PayDate: Date;
    AmountAtAllotment: number;
    IsDataValid:boolean;
    Remarks:string;
}