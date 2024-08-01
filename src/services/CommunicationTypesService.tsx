import { CommunicationTypesModel } from "../models/CommunicationTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CommunicationTypesModel = {
  CommunicationTypeId: "",
  CommunicationType: "",
  OnlyForOfficeBearer: true,
  Active: true,
  IsToSendSelective: true,
  IsApprovalNeeded: true,
  NeedToClose: true,
  IsToShowTenant: true,
};
const url = '/api/CommunicationTypes';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: CommunicationTypesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CommunicationTypesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const communicationtypeService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};