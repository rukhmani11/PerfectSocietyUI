export interface SocietyBillSeriesModel {
    SocietyId: string;
    BillAbbreviation: string;
    TaxId: string;
    BillingFrequency: string;
    BillDay: number;
    DueDays: number;
    Terms: string;
    Note: string;
    PrintArea: boolean;
    InterestRate: number;
    MinimumInterest: number;
    Osadjustment: string;
    NonOccupancyCharges: number;
    ChargeBillingCycleOrActualDate: string;
    InterChargeFromBillDateOrDueDate: string;
} 
