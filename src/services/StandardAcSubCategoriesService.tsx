import { Guid } from "guid-typescript";
import { StandardAcSubCategoriesModel } from "../models/StandardAcSubCategoriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardAcSubCategoriesModel = {
  SubCategoryId:  Guid.EMPTY,
  SubCategory: "",
  CategoryId: "",
  PartDetails: true,
  Sequence: 0,
};

const url = '/api/StandardAcSubCategories';
function getById(id: number) {
  return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardAcSubCategoriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardAcSubCategoriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const standardAcSubCategoriesService = {
  initialFieldValues,
  getById,
  getSelectList,
  getAll,
  post,
  put,
  remove,
};