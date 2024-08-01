import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { AcTransactionVoucherModel, BillRegisterReportModel, CollectionReportModel, MemberBalanceReportModel, MemberLedgerReportModel, ParkingRegisterReportModel, PayInSlipModel, SocietyInvestmentReportModel } from "../models/SocietyReportModel";

const url = '/api/SocietyReport';

const initialMemberLedgerReportFieldValues: MemberLedgerReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    SocietyBuildingUnitId: "",
    SocietyBuildingId: "",
    FromDate: null,
    ToDate: null,
    IsDetails: false
}

const initialMemberBalanceReportFieldValues: MemberBalanceReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    SocietyBuildingId: "",
    BillAbbreviation: "",
    BalanceFilter: "",
    IsDetails: false,
    Amount: null,
}

const initialBillRegisterReportFieldValues: BillRegisterReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    SocietyBuildingId: "",
    BillAbbreviation: "",
    FromDate: null,
    ToDate: null,
    IsDetails: false,
    IsAllColumns: false,
}

const initialCollectionReportFieldValues: CollectionReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    SocietyBuildingId: "",
    FromDate: null,
    ToDate: null,
}

const initialSocietyInvestmentReportFieldValues: SocietyInvestmentReportModel = {
    SocietySubscriptionId: "",
    IsPending: false,
    FromDate: null,
    ToDate: null,
}

const initialPayInSlipFieldValues: PayInSlipModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    BankId: "",
    BillAbbreviation: "",
    FromDate: null,
    ToDate: null,
}

const initialParkingRegisterReportFieldValues: ParkingRegisterReportModel = {
    SocietyId: "",
    SocietySubscriptionId: "",
    SocietyBuildingId: "",
    SocietyBuildingUnitId: "",
    SocietyParkingId: "",
    FromDate: null,
    ToDate: null,
    Status: 'All'
}

function membersRegisterPdf(subscriptionId: string) {
    return customAxios.get(`${url}/MembersRegister/${subscriptionId}`, { responseType: 'blob' });
}

function membersRegisterExcel(subscriptionId: string) {
    return customAxios.get(`${url}/MembersRegisterExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}
function lienRegisterExcel(subscriptionId: string) {
    return customAxios.get(`${url}/LienRegisterExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}

function nominationRegisterPdf(subscriptionId: string) {
    return customAxios.get(`${url}/NominationRegister/${subscriptionId}`, { responseType: 'blob' });
}

function memberLedgerReportPdf(payload: MemberLedgerReportModel) {
    return customAxios.post(`${url}/MemberLedgerReport`, payload, { responseType: 'blob' || 'json' });
}

function memberBalanceReportPdf(payload: MemberBalanceReportModel) {
    return customAxios.post(`${url}/MemberBalanceReport`, payload, { responseType: 'blob' || 'json' });
}

function memberBalanceReportExcel(payload: MemberBalanceReportModel) {
    return customAxios.post(`${url}/MemberBalanceReportExportToExcel`, payload, { responseType: 'blob' || 'json' });
}

function billRegisterReportPdf(payload: BillRegisterReportModel) {
    return customAxios.post(`${url}/BillRegisterReport`, payload, { responseType: 'blob' || 'json' });
}

function billRegisterReportExcel(payload: BillRegisterReportModel) {
    return customAxios.post(`${url}/BillRegisterReportExportToExcel`, payload, { responseType: 'blob' || 'json' });
}

function collectionReportPdf(payload: CollectionReportModel) {
    return customAxios.post(`${url}/CollectionReport`, payload, { responseType: 'blob' || 'json' });
}

function collectionReversalReportPdf(payload: CollectionReportModel) {
    return customAxios.post(`${url}/CollectionReversalReport`, payload, { responseType: 'blob' || 'json' });
}

function MemberLedgerFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/MemberLedgerFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function MemberLedgerFinalReportExcel(societySubscriptionId: string) {
    return customAxios.get(`${url}/MemberLedgerFinalReportExcel/${societySubscriptionId}`, { responseType: 'blob' });
}

function MemberBalancesFinalReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/MemberBalancesFinalReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function societyInvestmentReport(payload: SocietyInvestmentReportModel) {
    return customAxios.post(`${url}/SocietyInvestmentReport`, payload, { responseType: 'blob' || 'json' });
}

function acTransactionVoucher(payload: AcTransactionVoucherModel) {
    return customAxios.post(`${url}/AcTransactionVoucher`, payload, { responseType: 'blob' || 'json' });
}

function acTransactionVoucherForRange(payload: AcTransactionVoucherModel) {
    return customAxios.post(`${url}/AcTransactionVoucherForRange`, payload, { responseType: 'blob' || 'json' });
}

function committeeMembersExcel(subscriptionId: string) {
    return customAxios.get(`${url}/CommitteeMembersExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}

function jointHolderRegisterExcel(subscriptionId: string) {
    return customAxios.get(`${url}/JointHolderRegisterExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}

function shareRegisterExcel(subscriptionId: string) {
    return customAxios.get(`${url}/ShareRegisterExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}

function shareTransferReportExcel(subscriptionId: string) {
    return customAxios.get(`${url}/ShareTransferReportExportToExcel/${subscriptionId}`, { responseType: 'blob' });
}

function jFormReportPdf(subscriptionId: string) {
    return customAxios.get(`${url}/JFormReport/${subscriptionId}`, { responseType: 'blob' });
}

function jFormReportExcel(subscriptionId: string) {
    return customAxios.get(`${url}/JFormReportExcel/${subscriptionId}`, { responseType: 'blob' });
}

function iFormReportPdf(subscriptionId: string) {
    return customAxios.get(`${url}/IFormReport/${subscriptionId}`, { responseType: 'blob' });
}

function getForPayInSlipForm(societySubscriptionId: string) {
    return customAxios.get(`${url}/GetForPayInSlipForm/${societySubscriptionId}`, axiosRetryConfig);
}

function payInSlipPdf(payload: PayInSlipModel) {
    return customAxios.post(`${url}/PayInSlip`, payload, { responseType: 'blob' || 'json' });
}

function shareLedgerReport(societySubscriptionId: string) {
    return customAxios.get(`${url}/ShareLedgerReport/${societySubscriptionId}`, { responseType: 'blob' });
}

function parkingRegisterReportExcel(payload: ParkingRegisterReportModel) {
    return customAxios.post(`${url}/ParkingRegisterReportExportToExcel`, payload, { responseType: 'blob' });
    //return customAxios.post(`${url}/ParkingRegisterReportExportToExcel`, payload);
}

export const societyReportService = {
    initialMemberLedgerReportFieldValues,
    initialMemberBalanceReportFieldValues,
    initialBillRegisterReportFieldValues,
    initialCollectionReportFieldValues,
    initialSocietyInvestmentReportFieldValues,
    initialPayInSlipFieldValues,
    initialParkingRegisterReportFieldValues,
    membersRegisterPdf,
    membersRegisterExcel,
    lienRegisterExcel,
    nominationRegisterPdf,
    memberLedgerReportPdf,
    memberBalanceReportPdf,
    memberBalanceReportExcel,
    billRegisterReportPdf,
    billRegisterReportExcel,
    collectionReportPdf,
    collectionReversalReportPdf,
    MemberLedgerFinalReport,
    MemberLedgerFinalReportExcel,
    MemberBalancesFinalReport,
    societyInvestmentReport,
    acTransactionVoucher,
    acTransactionVoucherForRange,
    committeeMembersExcel,
    jointHolderRegisterExcel,
    jFormReportPdf,
    jFormReportExcel,
    iFormReportPdf,
    shareRegisterExcel,
    shareTransferReportExcel,
    shareLedgerReport,
    getForPayInSlipForm,
    payInSlipPdf,
    parkingRegisterReportExcel
}