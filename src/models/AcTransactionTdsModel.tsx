export interface AcTransactionTdsModel{
    AcTransactionTdsid:string;
    AcTransactionId:string;
    SocietyId:string;
    TdscategoryId:string;
    TdsacccountId:string;
    AcHeadId:string;
    GrossAmount:number;
    Tdsamount:number;
    PayTransactionId:string;
    TdsdepositDate:Date | null;
    ChallanNo:string;
    Bsrcode:string;
    ReceiptNo:string;
    CertificateNo:string;
    CertificateDate:Date | null;
}