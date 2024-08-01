import { SmsModel } from "../models/SmsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SmsModel = {
  Smsid: "",
  Smstype: "",
  Smsmessage: "",
  DltEnglishId: "",
};

const url = '/api/Sms';

function post(payload: SmsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function put(payload: SmsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const smsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,


};
