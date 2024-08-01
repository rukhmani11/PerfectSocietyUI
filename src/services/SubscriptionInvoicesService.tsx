import { SubscriptionInvoicesModel } from "../models/SubscriptionInvoicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SubscriptionInvoicesModel = {
  SubscriptionInvoiceId: "",
  AcYear: "",
  Serial: 0,
  InvoiceNo: "",
  InvoiceDate: null,
  DueDate: null,
  SubscriberId: "",
  SocietyId: "",
  TariffId: "",
  CouponNo: "",
  Amount: 0,
  Discount: 0,
  Tax: "",
  TaxAmount: 0,
  InvoiceAmount: 0,
  PaidAmount: 0,
  PaidOn: null,
  PayModeCode: "",
  PayRefNo: "",
  PayRefDate: null,
  BankId: "",
  Branch: "",
};
const url = '/api/SubscriptionInvoices';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: SubscriptionInvoicesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SubscriptionInvoicesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SubscriptionInvoicesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};