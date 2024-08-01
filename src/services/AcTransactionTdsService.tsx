import { AcTransactionTdsModel } from "../models/AcTransactionTdsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: AcTransactionTdsModel = {
  AcTransactionId: "",
  SocietyId: "",
  AcHeadId: "",
  AcTransactionTdsid: "",
  TdscategoryId: "",
  TdsacccountId: "",
  GrossAmount: 0,
  Tdsamount: 0,
  PayTransactionId: "",
  TdsdepositDate: null,
  ChallanNo: "",
  Bsrcode: "",
  ReceiptNo: "",
  CertificateNo: "",
  CertificateDate: null
}
const url = '/api/AcTransactionTds';
function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: AcTransactionTdsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcTransactionTdsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const ActransactionTdsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
