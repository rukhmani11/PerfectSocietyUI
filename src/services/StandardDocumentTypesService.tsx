import { StandardDocumentTypesModel } from "../models/StandardDocumentTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardDocumentTypesModel = {
  DocumentTypeId: "",
  DocumentType: "",
  EntityName: "",
  MaxSizeInMb: 0,
  AskFromDateToDate: true,
  Active: true,
  UploadedByMember: true,
  ViewByMember: true,
  UploadedByTenant: true,
  ViewByTenant: true,
  ViewByAuditor: true,
};

const url = '/api/StandardDocumentTypes';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardDocumentTypesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardDocumentTypesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const StandardDocumentTypesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};