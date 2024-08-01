export interface SocietyDocumentTypesModel{
    DocumentTypeId:string;
    SocietyId:string;
    DocumentType:string;
    EntityName:string;
    MaxSizeInMb:number;
    AskFromDateToDate:boolean;
    Active:boolean;
    UploadedByMember:boolean;
    ViewByMember:boolean;
    UploadedByTenant:boolean;
    ViewByTenant:boolean;
    ViewByAuditor:boolean;
}