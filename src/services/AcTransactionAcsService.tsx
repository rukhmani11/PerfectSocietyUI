import { Guid } from "guid-typescript";
import { AcTransactionAcsModel, BankReconciliationSearchModel } from "../models/AcTransactionAcsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const url = '/api/AcTransactionAcs';

const initialFieldValues: AcTransactionAcsModel = {
  AcTransactionAcId: Guid.EMPTY,
  AcTransactionId: "",
  SocietyId: "",
  AcHeadId: "",
  Nature: "",
  DrCr: '',
  Amount: 0,
  Particulars: "",
  Reconciled: null,
  DocType: "",
}

const initialBankReconcilationSearchFields: BankReconciliationSearchModel = {
  SocietyId: "",
  SocietySubscriptionId: "",
  AcHeadId: "",
  FromDate: null,
  ToDate: null,
  DrCr: 'B',
  ReconciledOn: null,
  UpdateOnlyBlank: false
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: AcTransactionAcsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcTransactionAcsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getByAcTransactionId(AcTransactionId: string) {
  return customAxios.get(`${url}/GetByAcTransactionId/${AcTransactionId}`, axiosRetryConfig);
}

function getAcTransactionFormSocietyIDNature(societySubscriptionId: string, docType: string, acTransactionId: string) {
  return customAxios.get(`${url}/GetAcTransactionFormSocietyIDNature/${societySubscriptionId}/${docType}/${acTransactionId}`, axiosRetryConfig);
}

function getForAcTransactionACListPage(societySubscriptionId: string, docType: string, acTransactionId: string) {
  return customAxios.get(`${url}/GetForAcTransactionACListPage/${societySubscriptionId}/${docType}/${acTransactionId}`, axiosRetryConfig);
}

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getBankReconciliation(payload: BankReconciliationSearchModel) {
  return customAxios.post(`${url}/GetBankReconciliation`, payload, axiosRetryConfig);
}

function editReconciliationDate(payload : any) {
  return customAxios.post(`${url}/EditReconciliationDate`, payload, axiosRetryConfig);
 // return customAxios.get(`${url}/EditReconciliationDate?AcTransactionAcId=${AcTransactionAcId}&ReconciledOn=${ReconciledOn}`, axiosRetryConfig);
}

function bankReconciliationExportToExcel(payload: BankReconciliationSearchModel) {
  return customAxios.post(`${url}/BankReconciliationExportToExcel`, payload, axiosRetryConfig);
}

export const acTransactionAcsService = {
  initialFieldValues,
  initialBankReconcilationSearchFields,
  getAll,
  post,
  put,
  remove,
  getByAcTransactionId,
  getAcTransactionFormSocietyIDNature,
  getForAcTransactionACListPage,
  getById,
  getBankReconciliation,
  editReconciliationDate,
  bankReconciliationExportToExcel
};