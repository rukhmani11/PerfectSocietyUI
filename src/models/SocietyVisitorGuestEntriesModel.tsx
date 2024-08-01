export interface SocietyVisitorGuestEntriesModel {
    SocietyVisitorGuestEntriesId: string;
    VisitorName: string;
    MobileNumber : string;
    NumberOfVisitors : number;
    VehicleNumber: string;
    Remarks: string;
    VisitType: string;
    VisitStatus: string;
    WelcomeCode: string;
    PlannedDateTime: Date;
    VisitorInDateTime: Date;
    VisitorOutDateTime: Date;
    VisitToUserId: string;
    SocietyId: string;
    VisitToUserType: string;
    VisitToUserTypeUserId: string;
    VisitToSocietyBuildingUnitId: string;
  }