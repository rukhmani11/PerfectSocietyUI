import { Guid } from "guid-typescript";
import { SocietyReceiptRangeModel, SocietyReceiptsModel } from "../models/SocietyReceiptsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { blob } from "stream/consumers";
import { config } from "../utility/Config";

const initialFieldValues: SocietyReceiptsModel = {
  SocietyReceiptId: Guid.EMPTY,
  SocietyId: "",
  SocietyBuildingUnitId: "",
  SocietyMemberId: "",
  SocietySubscriptionId: "",
  ReceiptDate: null,
  AcYear: "",
  Serial: null,
  BillAbbreviation: "",
  ReceiptNo: "",
  Amount: null,
  PrincipalAdjusted: null,
  InterestAdjusted: null,
  NonChgAdjusted: null,
  TaxAdjusted: null,
  Advance: null,
  Particulars: "",
  PayModeCode: "",
  PayRefNo: "",
  PayRefDate: null,
  BankId: "",
  // BankName: "",
  Branch: "",
  AcTransactionId: "",
  IsPrinted: false
};

const url = '/api/SocietyReceipts';

function getById(id: number) {
  return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyReceiptsModel) {

  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyReceiptsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSocietyReceiptBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetSocietyReceiptBySocietyId/${societyId}`, axiosRetryConfig);
}

function getSelectListBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}
function getSelectListForMember(billAbbreviation: string, societyBuildingUnitId: string, societyMemberId: string) {
  return customAxios.get(`${url}/GetSelectListForMember/${billAbbreviation}/${societyBuildingUnitId}/${societyMemberId}`, axiosRetryConfig);
}

function validateReceiptDate(societyid: string, billAbbreviation: string, societySubscriptionId: string) {

  return customAxios.get(`${url}/ValidateReceiptDate/${societyid}/${billAbbreviation}/${societySubscriptionId}`, axiosRetryConfig);
}
function createPdf(id: string) {
  return customAxios.get(`${url}/CreatePdf/${id}`, { responseType: 'blob' });
  // Axios.get(url, {
  //     responseType: 'blob',
  //   }).then(res => {
  //     fileDownload(res.data, filename);
  //   });
}

function getDetailsForSocietyReceiptList(societySubscriptionId: string) {
  return customAxios.get(`${url}/GetDetailsForSocietyReceiptList/${societySubscriptionId}`, axiosRetryConfig);
}

function downloadTemplate(societyId: string) {
  return customAxios.get(`${url}/DownloadImportTemplate/${societyId}`, { responseType: "blob" });
}

function uploadExcel(files: File[], payload: any) {

  const formData = new FormData();
  if (files != null && files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  }

  formData.append("data", JSON.stringify(payload));
  return customAxios.post(
    `${url}/UploadExcel`,
    formData,
    config.formDataConfig
  );
}

function getBySocietyReceiptForRange(payload: SocietyReceiptRangeModel) {
  return customAxios.post(`${url}/GetSocietyReceiptBySocietyIdForRange`, payload, axiosRetryConfig);
}

function sendReceiptEmail(payload: any) {
  return customAxios.post(`${url}/SendReceiptEmail`, payload, axiosRetryConfig);
}

export const societyReceiptsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  getSocietyReceiptBySocietyId,
  createPdf,
  getSelectListBySocietyId,
  getSelectListForMember,
  validateReceiptDate,
  getDetailsForSocietyReceiptList,
  downloadTemplate,
  uploadExcel,
  getBySocietyReceiptForRange,
  sendReceiptEmail,
};
