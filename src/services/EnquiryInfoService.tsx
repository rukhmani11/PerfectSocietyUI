import { EnquiryInfoModel } from "../models/EnquiryInfoModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: EnquiryInfoModel = {
  EnquiryInfoId: "",
  FirstName: "",
  LastName: "",
  SocietyName: "",
  PhoneNumber: "",
  EmailId: "",
  CityTown: "",
  Enquiry: "",
  RequestIp: "",
  Pin: 0,
  EmailSendOn: null,
  ExpiredOn: null
};

const url = "/api/PasswordQuestions";

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: EnquiryInfoModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: EnquiryInfoModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const EnquiryInfoService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
