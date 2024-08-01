export interface SubscriptionInvoicesModel {
  SubscriptionInvoiceId: string;
  AcYear: string;
  Serial: number;
  InvoiceNo: string;
  InvoiceDate: Date;
  DueDate: Date;
  SubscriberId: string;
  SocietyId: string;
  TariffId: string;
  CouponNo: string;
  Amount: number;
  Discount: number;
  Tax: string;
  TaxAmount: number;
  InvoiceAmount: number;
  PaidAmount: number;
  PaidOn: Date;
  PayModeCode: string;
  PayRefNo: string;
  PayRefDate: Date;
  BankId: string;
  Branch: string;
} 