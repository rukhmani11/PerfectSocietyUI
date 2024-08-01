import { OccupationsModel } from "../models/OccupationsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: OccupationsModel = {
  OccupationId: "",
  Occupation: "",
  Active: true,

};
const url = '/api/Occupations';

function post(payload: OccupationsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function put(payload: OccupationsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
export const occupationsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getSelectList,
};
