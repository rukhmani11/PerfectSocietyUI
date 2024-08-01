import { SocietyUsersModel } from "../models/SocietyUsersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyUsersModel = {
  SocietyId:"",
  UserId: "",
  Access:"",
};

const url = '/api/SocietyUsers';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyUsersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyUsersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyUsersService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
