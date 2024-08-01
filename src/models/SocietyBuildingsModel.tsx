export interface SocietyBuildingsModel {
    SocietyBuildingId: string;
    SocietyId: string;
    Building: string;
    NoOfFloors: number;
    Lift: boolean;
}

export interface SocietyBuildingTitleModel {
    //SocietyId: string;
    SocietyBuildingId: string;
    SocietyBuildingUnitId: string;
    //SocietyBuildingUnitChargeHeadId: string;

    // SocietyName: string;
    // Building:string;
    // Unit: string;
    //ChargeHead: string;
}
