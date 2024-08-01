import { SocietyDocumentLogsModel } from "../models/SocietyDocumentLogsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyDocumentLogsModel={
    SocietyDocumentLogId:"",
    SocietyId:"",
    DocumentTemplateId:"",
    DocumentName:"",
    DocumentContent:"",
    IsPrinted:true,
}

const url = '/api/SocietyDocumentLogs';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyDocumentLogsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyDocumentLogsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societydocumentlogsService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};