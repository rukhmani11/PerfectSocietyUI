import { SocietyBuildingTitleModel, SocietyBuildingsModel } from "../models/SocietyBuildingsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { Guid } from 'guid-typescript';

const initialFieldValues: SocietyBuildingsModel = {
    SocietyBuildingId: Guid.EMPTY,
    SocietyId: Guid.EMPTY,
    Building: "",
    NoOfFloors: 0,
    Lift: true
}

const url = '/api/SocietyBuildings';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function getBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}
function post(payload: SocietyBuildingsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function put(payload: SocietyBuildingsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}
function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function getPageTitle(payload: SocietyBuildingTitleModel) {
    return customAxios.post(`${url}/GetPageTitle`, payload, axiosRetryConfig);
}
function getSelectListBySocietyId(societyId:string) {
    return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
  }
  
export const societyBuildingsService = {
    initialFieldValues,
    getAll,
    getBySocietyId,
    post,
    put,
    remove,
    getById,
    getPageTitle,
    getSelectListBySocietyId
};