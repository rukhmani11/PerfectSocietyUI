import { BankReconciliationSearchModel } from "../models/AcTransactionAcsModel";
import { BalanceSheetModel, BankReconciliationReportModel, IncomeExpenditureReportModel, AccountingReportModel } from "../models/AccountingReportModel";
import { customAxios } from "./AxiosHttpCommon";

const url = '/api/AccountingReport';

const initialAccountingReportFieldValues: AccountingReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    DocType: '',
    FromDate: null,
    ToDate: null,
    AcHeadIds: ''
}

const initialIncomeExpenditureStatementFieldValues: IncomeExpenditureReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    FromDate: null,
    ToDate: null,
}

const initialBalanceSheetFieldValues: BalanceSheetModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    AsOnDate: null
}

const initialBankReconciliationReportFieldValues: BankReconciliationReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    AsOnDate: null,
    AcHeadId: ""
}

function transactionRegisterReport(payload: AccountingReportModel) {
    return customAxios.post(`${url}/TransactionRegisterReport`, payload, { responseType: 'blob' });
}

function transactionExportToExcel(payload: AccountingReportModel) {
    return customAxios.post(`${url}/ShareTransactionExportToExcel`, payload, { responseType: 'blob' || 'json' });
}
function trialBalanceReport(payload: AccountingReportModel) {
    return customAxios.post(`${url}/TrialBalanceReport`, payload, { responseType: 'blob' });
}

function GeneralLedgerReport(payload: AccountingReportModel) {
    return customAxios.post(`${url}/GeneralLedgerReport`, payload, { responseType: 'blob' });
}

function incomeExpenditureStatement(payload: IncomeExpenditureReportModel) {
    return customAxios.post(`${url}/IncomeExpenditureStatement`, payload, { responseType: 'blob' });
}

function incomeExpenditureStatementExcel(payload: IncomeExpenditureReportModel) {
    return customAxios.post(`${url}/IncomeExpenditureStatementExcel`, payload, { responseType: 'blob' });
}

function incomeExpenditureSchedule(payload: IncomeExpenditureReportModel) {
    return customAxios.post(`${url}/IncomeExpenditureSchedule`, payload, { responseType: 'blob' });
}

function balanceSheet(payload: BalanceSheetModel) {
    return customAxios.post(`${url}/BalanceSheet`, payload, { responseType: 'blob' });
}

function balanceSheetExcel(payload: BalanceSheetModel){
    return customAxios.post(`${url}/BalanceSheetExcel`,payload,{ responseType: 'blob' })
}

function balanceSheetSchedule(payload: BalanceSheetModel) {
    return customAxios.post(`${url}/BalanceSheetSchedule`, payload, { responseType: 'blob' });
}

function bankReconciliationReport(payload: BankReconciliationReportModel) {
    return customAxios.post(`${url}/BankReconciliationReport`, payload, { responseType: 'blob' });
}
function bankReconciliationExportToExcel(payload: BankReconciliationReportModel) {
    return customAxios.post(`${url}/BankReconciliationExportToExcel`, payload, { responseType: 'blob' || 'json' });
}
function bankReconciliationReportExportToExcel(payload: BankReconciliationSearchModel) {
    return customAxios.post(`${url}/BankReconciliationReportExportToExcel`, payload, { responseType: 'blob' });
}

function receiptAndPaymentStatementReport(payload: AccountingReportModel) {
    return customAxios.post(`${url}/ReceiptAndPaymentStatementReport`, payload, { responseType: 'blob' });
}

function PDFIncomeExpenditure(societySubscriptionId: string) {
    return customAxios.get(`${url}/PDFIncomeExpenditure/${societySubscriptionId}`, { responseType: 'blob' });
}

function PDFScheduleToIncomeExpenditure(societySubscriptionId: string) {
    return customAxios.get(`${url}/PDFScheduleToIncomeExpenditure/${societySubscriptionId}`, { responseType: 'blob' });
}

function BalanceSheetFinalReport(societySubscriptionId: string) {
    
    return customAxios.get(`${url}/BalanceSheetFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function ScheduleToBalanceSheetFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/ScheduleToBalanceSheetFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function ScheduleToBalanceSheetExportToExcel(payload: BalanceSheetModel) {
    return customAxios.post(`${url}/ScheduleToBalanceSheetExportToExcel`, payload, { responseType: 'blob' });
}

function GeneralLedgerFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/GeneralLedgerFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function TrialBalanceFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/TrialBalanceFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function ReceiptAndPaymentStatementFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/ReceiptAndPaymentStatementFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function BankReconciliationFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/BankReconciliationFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}
function getIncomeExpenditureStatementExportToExcel(societySubscriptionId: string) {
    return customAxios.get(`${url}/IncomeExpenditureStatementExportToExcel/${societySubscriptionId}`, { responseType: 'blob' });
}

function generalLedgerReportExportToExcel(payload: AccountingReportModel) {
    return customAxios.post(`${url}/GeneralLedgerReportExportToExcel`, payload, { responseType: 'blob' });
}
function trialBalanceReportExcel(payload : AccountingReportModel){
    return customAxios.post(`${url}/TrialBalanceReportExcel`,payload, { responseType: 'blob' })
}

function FinalReporScheduleToBalanceSheetExportToExcel(societySubscriptionId: string) {                                                                                                                                             
    return customAxios.get(`${url}/FinalReporScheduleToBalanceSheetExportToExcel/${societySubscriptionId}`, { responseType: 'blob' });
}

function balanceSheetFinalReportExcel(societySubscriptionId: string) {                                                                                                                                             
    return customAxios.get(`${url}/BalanceSheetFinalReportExcel/${societySubscriptionId}`, { responseType: 'blob' });
}

function MsBalanceSheetTFormatEcxel(societySubscriptionId: string) {
    return customAxios.get(`${url}/MsBalanceSheetTFormatEcxel/${societySubscriptionId}`, { responseType: 'blob' });
}

function ExcelScheduleToIncomeExpenditure(societySubscriptionId: string) {
    return customAxios.get(`${url}/ExcelScheduleToIncomeExpenditure/${societySubscriptionId}`, { responseType: 'blob' });
}


function ExcelGeneralLedger(societySubscriptionId: string) {
    return customAxios.get(`${url}/ExcelGeneralLedger/${societySubscriptionId}`, { responseType: 'blob' });
}

function ExcelTrialBalance(societySubscriptionId: string) {
    return customAxios.get(`${url}/ExcelTrialBalance/${societySubscriptionId}`, { responseType: 'blob' });
}
function ExcelMemberLedgerFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/ExcelMemberLedgerFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

export const  accountingReportService = {
    initialAccountingReportFieldValues,
    initialIncomeExpenditureStatementFieldValues,
    initialBalanceSheetFieldValues,
    initialBankReconciliationReportFieldValues,
    transactionRegisterReport,
    trialBalanceReport,
    transactionExportToExcel,
    GeneralLedgerReport,
    incomeExpenditureStatement,
    incomeExpenditureSchedule,
    balanceSheet,
    balanceSheetSchedule,
    bankReconciliationReport,
    bankReconciliationExportToExcel,
    bankReconciliationReportExportToExcel,
    receiptAndPaymentStatementReport,
    PDFIncomeExpenditure,
    PDFScheduleToIncomeExpenditure,
    BalanceSheetFinalReport,
    ScheduleToBalanceSheetFinalReport,
    GeneralLedgerFinalReport,
    TrialBalanceFinalReport,
    ReceiptAndPaymentStatementFinalReport,
    BankReconciliationFinalReport,
    getIncomeExpenditureStatementExportToExcel,
    ScheduleToBalanceSheetExportToExcel,
    generalLedgerReportExportToExcel,
    trialBalanceReportExcel,
    balanceSheetExcel,
    incomeExpenditureStatementExcel,
    FinalReporScheduleToBalanceSheetExportToExcel,
    MsBalanceSheetTFormatEcxel,
    ExcelScheduleToIncomeExpenditure,
    ExcelGeneralLedger,
    ExcelTrialBalance,
    ExcelMemberLedgerFinalReport,
    balanceSheetFinalReportExcel,
}