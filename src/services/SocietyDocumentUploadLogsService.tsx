import { SocietyDocumentUploadLogsModel } from "../models/SocietyDocumentUploadLogsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyDocumentUploadLogsModel = {
  DocumentId: "",
  DocumentTypeId: "",
  SocietyId: "",
  SocietyMemberId: "",
  SocietyBuildingUnitId: "",
  AcTransactionId: "",
  AcHeadId: "",
  EntityName: "",
  DocumentNumber: "",
  DocumentName: "",
  Description: "",
  ValidityFrom: null,
  ValidityTo: null,
  SocietyMemberTenantId: "",
}

const url = '/api/SocietyDocumentUploadLogs';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyDocumentUploadLogsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyDocumentUploadLogsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societydocumentuploadlogsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};