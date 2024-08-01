import { Guid } from "guid-typescript";
import { StandardAcCategoriesModel } from "../models/StandardAcCategoriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardAcCategoriesModel = {
  CategoryId: Guid.EMPTY, 
  Category: "",
  DrCr: "",
  Nature: "",
  Sequence: 0
};

const url = '/api/StandardAcCategories';

function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function getById(id: number) {
  return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardAcCategoriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardAcCategoriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const standardAcCategoriesService = {
  initialFieldValues,
  getSelectList,
  getById,
  getAll,
  post,
  put,
  remove,
};
