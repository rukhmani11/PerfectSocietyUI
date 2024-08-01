import { StateModel } from "../models/StatesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StateModel = {
  StateId: "",
  StateCode: "",
  State: "",
  CountryCode: ""
};

const url = '/api/State';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function post(payload: StateModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StateModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const statesService = {
  initialFieldValues,
  getAll,
  getSelectList,
  post,
  put,
  remove,
};
