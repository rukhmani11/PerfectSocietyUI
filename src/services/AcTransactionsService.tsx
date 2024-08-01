import { Guid } from "guid-typescript";
import { AcTransactionsModel } from "../models/AcTransactionsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { AcTransactionVoucherModel } from "../models/SocietyReportModel";

const url = '/api/AcTransactions';

const initialFieldValues: AcTransactionsModel = {
  AcTransactionId: Guid.EMPTY,
  SocietyId: "",
  SocietySubscriptionId: "",
  DocType: "",
  Serial: 0,
  AcYear: "",
  DocNo: "",
  DocDate: null,
  Particulars: "",
  AcHeadId: "",
  DrAmount: 0,
  CrAmount: 0,
  PayModeCode: "",
  PayRefNo: "",
  PayRefDate: null,
  BankId: "",
  Branch: "",
  BillNo: "",
  BillDate: null,
  DelDocNo: "",
  DelDocDate: null,
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: AcTransactionsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcTransactionsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBySocietySubscriptionIdAndDocTypeForRange(payload: AcTransactionVoucherModel) {
  return customAxios.post(`${url}/GetBySocietySubscriptionIdAndDocTypeForRange`, payload, axiosRetryConfig);
}

function getForAcTransactionListPage(societySubscriptionId: string, docType: string) {
  return customAxios.get(`${url}/GetForAcTransactionListPage/${societySubscriptionId}/${docType}`, axiosRetryConfig);
}

function getForAcTransactionFormPage(societySubscriptionId: string, docType: string) {
  return customAxios.get(`${url}/GetForAcTransactionFormPage/${societySubscriptionId}/${docType}`, axiosRetryConfig);
}

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}


export const actransactionsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getBySocietySubscriptionIdAndDocTypeForRange,
  getById,
  getForAcTransactionListPage,
  getForAcTransactionFormPage
};