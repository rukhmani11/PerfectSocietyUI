import { Guid } from "guid-typescript";
import { SocietyParkingsModel } from "../models/SocietyParkingsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyParkingsModel = {
  SocietyParkingId: Guid.EMPTY,
  SocietyId: "",
  ParkingNo: "",
  ParkingTypeId: "",
}

const url = '/api/SocietyParkings';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyParkingsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function put(payload: SocietyParkingsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBySocietyId(societyId:string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
function getSelectListBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

export const societyparkingsService = {
  initialFieldValues,
  getAll,
  getById,
  post,
  put,
  remove,
  getBySocietyId,
  getSelectList,
  getSelectListBySocietyId,

};