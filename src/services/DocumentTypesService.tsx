import { DocumentTypesModel } from "../models/DocumentTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: DocumentTypesModel = {
  DocumentTypeId: "",
  DocumentType: "",
  EntityName: "",
  DocumentSizeInMb: 0,
  AskFromDateToDate: true,
  Active: true,
};

const url = '/api/DocumentTypes';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: DocumentTypesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: DocumentTypesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const DocumentTypesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
