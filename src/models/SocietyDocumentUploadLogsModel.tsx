export interface SocietyDocumentUploadLogsModel{
    DocumentId:string;
    DocumentTypeId:string;
    SocietyId:string;
    SocietyMemberId:string;
    SocietyBuildingUnitId:string;
    AcTransactionId:string;
    AcHeadId:string;
    EntityName:string;
    DocumentNumber:string;
    DocumentName:string;
    Description:string;
    ValidityFrom: Date;
    ValidityTo: Date;
    SocietyMemberTenantId:string;
}