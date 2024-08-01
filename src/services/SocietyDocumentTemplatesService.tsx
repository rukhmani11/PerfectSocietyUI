import { SocietyDocumentTemplatesModel } from "../models/SocietyDocumentTemplatesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyDocumentTemplatesModel={
    DocumentTemplateId:"",
    SocietyId:"",
    TemplateName:"",
    DocumentName:"",
    TemplateContent:"",
}

const url = '/api/SocietyDocumentTemplates';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyDocumentTemplatesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyDocumentTemplatesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societydocumenttemplatesService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};