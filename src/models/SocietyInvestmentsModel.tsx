export interface SocietyInvestmentsModel {
    SocietyInvestmentId: string;
    SocietyId: string;
    BankId: string;
    Bank: string;
    DocumentNo: string;
    DocumentDate: Date;
    MaturityDate: Date;
    Amount: number;
    InterestRate: number;
    ChequeNo: string;
    ChequeDate: Date;
    MaturityAmount: number;
    ClosureDate: Date;
    ClosureAmount: number;
    RealizationDate: Date;
}