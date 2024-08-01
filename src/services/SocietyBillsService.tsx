import { Guid } from "guid-typescript";
import { SocietyBillsModel } from "../models/SocietyBillsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBillsModel = {
  SocietyBillId: Guid.EMPTY,
  SocietyId: "",
  SocietyBuildingUnitId: "",
  SocietyMemberId: "",
  SocietySubscriptionId: "",
  BillAbbreviation: "",
  AcYear: "",
  Serial: 0,
  BillNo: "",
  BillDate: null,
  UAmount: 0,
  ChgAmount: 0,
  NonChgAmount: 0,
  Arrears: 0,
  InterestArrears: 0,
  NonChgArrears: 0,
  TaxArrears: 0,
  Advance: 0,
  Interest: 0,
  Tax: "",
  TaxAmount: 0,
  PrincipalAdjusted: 0,
  InterestAdjusted: 0,
  NonChgAdjusted: 0,
  TaxAdjusted: 0,
  Payable: 0,
  Particulars: "",
  AcTransactionId: "",
  DueDate: null,
  BillEndDate: null,
  JiotraceId: 0,
  JiosentDate: null,
};

const initialFieldAddSocietyBillValues: any = {
  BillAbbreviation: "",
  BillDate: "",
};

const url = "/api/SocietyBills";

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getById(societyBillId: string) {
  return customAxios.get(`${url}/GetById/${societyBillId}`, axiosRetryConfig);
}
function post(payload: SocietyBillsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBillsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function generateBill(payload: any) {
  return customAxios.post(`${url}/GenerateBill`, payload, axiosRetryConfig);
}

function deleteBill(payload: any) {
  return customAxios.post(`${url}/DeleteBill`, payload, axiosRetryConfig);
}

function ListBillDatesBySubscriptionIDAndBillAbbr(
  societysubscriptionid: string,
  billAbbreviation: string
) {
  return customAxios.get(
    `${url}/ListBillDatesBySocietySubscriptionID/${societysubscriptionid}/${billAbbreviation}`,
    axiosRetryConfig
  );
}

function GetBySocietyIDBillDateBillAbbreviation(payload: any) {
  //${values.SocietyId}/${values.BillDate}/${values.BillAbbreviation}
  return customAxios.post(`${url}/GetBySocietyIDBillDateBillAbbreviation`, payload, axiosRetryConfig);
}

function SendBillEmail(payload: any) {
  return customAxios.post(`${url}/SendBillEmail`, payload, axiosRetryConfig);
}

function SendBillSms(payload: any) {
  return customAxios.post(`${url}/SendBillSms`, payload, axiosRetryConfig);
}

function GetBySocietyId(societyId: string) {
  return customAxios.get(
    `${url}/GetBySocietyId/${societyId}`,
    axiosRetryConfig
  );
}

// function createPdf(id: string) {
//   return customAxios.get(`${url}/CreatePdf/${id}`, { responseType: "blob" });
// }

function createBillsReceiptsPdf(payload: any) {
  //return customAxios.post(`${url}/GenerateBill`, payload, axiosRetryConfig);
  return customAxios.post(`${url}/CreateBillsReceiptsPdf`, payload, { responseType: "blob" });
}

function getLatestSocietyBill(societyid: string, billAbbreviation: string, societySubscriptionId: string) {
  return customAxios.get(`${url}/GetLatestSocietyBill/${societyid}/${billAbbreviation}/${societySubscriptionId}`, axiosRetryConfig);
}
function getViewSocietyBill(societyBillId: string, societySubscriptionId: string) {
  return customAxios.get(`${url}/ViewSocietyBill/${societyBillId}/${societySubscriptionId}`, axiosRetryConfig);
}
export const societyBillsService = {
  initialFieldValues,
  getAll,
  getById,
  post,
  put,
  remove,
  generateBill,
  deleteBill,
  GetBySocietyId,
  ListBillDatesBySubscriptionIDAndBillAbbr,
  GetBySocietyIDBillDateBillAbbreviation,
  SendBillEmail,
  SendBillSms,
  //createPdf,
  createBillsReceiptsPdf,
  initialFieldAddSocietyBillValues,
  getLatestSocietyBill,
  getViewSocietyBill
};
