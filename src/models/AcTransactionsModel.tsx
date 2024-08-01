export interface AcTransactionsModel {
    AcTransactionId: string;
    SocietyId: string;
    SocietySubscriptionId: string;
    DocType: string;
    Serial: number;
    AcYear: string;
    DocNo: string;
    DocDate: Date;
    Particulars: string;
    AcHeadId: string;
    DrAmount: number;
    CrAmount: number;
    PayModeCode: string;
    PayRefNo: string;
    PayRefDate: Date;
    BankId: string;
    Branch: string;
    BillNo: string;
    BillDate: Date;
    DelDocNo: string;
    DelDocDate: Date;
}
