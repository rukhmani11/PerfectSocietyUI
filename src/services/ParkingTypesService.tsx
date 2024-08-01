import { Guid } from "guid-typescript";
import { ParkingTypeModel } from "../models/ParkingTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: ParkingTypeModel = {
  ParkingTypeId: Guid.EMPTY,
  ParkingType: "",
  Active: true
};

const url = '/api/ParkingTypes';

function getById(id: number) {
  
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
function post(payload: ParkingTypeModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: ParkingTypeModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const parkingtypeService = {
  initialFieldValues,
  getById,
  getAll,
  getSelectList,
  post,
  put,
  remove,
};
