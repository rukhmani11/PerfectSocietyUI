import { DocumentAccessMappingModel } from "../models/DocumentAccessMappingModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: DocumentAccessMappingModel = {
  DocumentAccessMappingId: "",
  DocumentTypeId: "",
  RoleId: "",
  IsAllowToUpload: true,

};
const url = '/api/DocumentAccessMapping';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: DocumentAccessMappingModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: DocumentAccessMappingModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const DocumentAccessMappingService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};