import { StandardDocumentTemplatesModel } from "../models/StandardDocumentTemplatesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardDocumentTemplatesModel = {
  DocumentTemplateId: "",
  TemplateName: "",
  DocumentName: "",
  TemplateContent: "",
};

const url = '/api/StandardDocumentTemplates';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardDocumentTemplatesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardDocumentTemplatesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const StandardDocumentTemplatesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};