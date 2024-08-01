import { SocietyDocumentTypesModel } from "../models/SocietyDocumentTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyDocumentTypesModel={
    DocumentTypeId:"",
    SocietyId:"",
    DocumentType:"",
    EntityName:"",
    MaxSizeInMb:0,
    AskFromDateToDate:true,
    Active:true,
    UploadedByMember:true,
    ViewByMember:true,
    UploadedByTenant:true,
    ViewByTenant:true,
    ViewByAuditor:true,
}

const url = '/api/SocietyDocumentTypes';


function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyDocumentTypesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyDocumentTypesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const societydocumenttypesService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};