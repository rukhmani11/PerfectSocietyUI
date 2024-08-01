import { SocietyMaterialInwardEntriesModel } from "../models/SocietyMaterialInwardEntriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyMaterialInwardEntriesModel = {
  SocietyMaterialInwardEntriesId: "",
  MaterialInwardToUserId: "",
  Company: "",
  NoOfParcels: 0,
  Remarks: "",
  MaterialInwardStatus: "",
  ReceivedDateTime: null,
  SocietyId: "",
  WelcomeCode: "",
  MaterialInwardToSocietyBuildingUnitId: "",
  MaterialInwardToUserType: "",
  MaterialInwardToUserTypeUserId: "",
}


const url = '/api/SocietyMaterialInwardEntries';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMaterialInwardEntriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMaterialInwardEntriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyMaterialInwardEntriesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};