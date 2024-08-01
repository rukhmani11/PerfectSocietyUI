import { Guid } from "guid-typescript";
import { MemberClassesModel } from "../models/MemberClassesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
const initialFieldValues: MemberClassesModel = {
  MemberClassId: Guid.EMPTY,
  MemberClass: "",
  Active: true,
};

const url = '/api/MemberClasses';

function post(payload: MemberClassesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function put(payload: MemberClassesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {

  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

export const memberClassesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  getSelectList,
};
