import { DocumentUploadLogsModel } from "../models/DocumentUploadLogsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: DocumentUploadLogsModel = {
  DocumentId: "",
  DocumentTypeId: "",
  SocietyId: "",
  SocietyMemberId: "",
  SocietyBuildingUnitId: "",
  EntityName: "",
  DocumentName: "",
  ValidityFrom: null,
  ValidityTo: null,
  DocumentSizeInMb: 0,

};
const url = '/api/DocumentUploadLogs';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: DocumentUploadLogsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: DocumentUploadLogsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const DocumentUploadLogsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};