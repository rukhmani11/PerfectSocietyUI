import { SocietyMaterialOutwardEntriesModel } from "../models/SocietyMaterialOutwardEntriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyMaterialOutwardEntriesModel={
    SocietyMaterialOutwardEntriesId:"",
    MaterialOutwardByUserId:"",
    TakenBy:"",
    Remarks:"",
    MaterialOutwardStatus:"",
    SocietyId:"",
    MaterialDescription:"",
    MaterialOutwardToSocietyBuildingUnitId:"",
    MaterialOutwardToUserType:"",
    MaterialOutwardToUserTypeUserId:"",
}

const url = '/api/SocietyMaterialOutwardEntries';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMaterialOutwardEntriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMaterialOutwardEntriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyMaterialOutwardEntriesService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};