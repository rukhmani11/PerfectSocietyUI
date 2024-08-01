import { Guid } from "guid-typescript";
import { AcCategoriesModel } from "../models/AcCategoriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: AcCategoriesModel = {
  SocietyId: "",
  CategoryId:Guid.EMPTY,
  Category: "",
  DrCr: "",
  Nature: "",
  Sequence: 0,
  Active: true,
};
const url = '/api/AcCategories';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: AcCategoriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcCategoriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}
function getById(id: number,societyId: string) {
  return customAxios.get(`${url}/GetById/${id}/${societyId}`, axiosRetryConfig);
}

function getSelectListBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

export const acCategorieService = {
  initialFieldValues,
  getSelectListBySocietyId,
  getAll,
  post,
  put,
  remove,
  getBySocietyId,
  getById,
};