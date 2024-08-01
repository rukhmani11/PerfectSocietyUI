import { PayModesModel } from "../models/PayModesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: PayModesModel = {
  PayModeCode: "",
  PayMode: "",
  AskDetails: true,
  Active: true,
  AcHeadId: ""
};

const url = '/api/PayModes';

function getById(PayModeCode: number) {
  return customAxios.get(`${url}/GetByid/${PayModeCode}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: PayModesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: PayModesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
export const payModesService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
  getSelectList,
};
