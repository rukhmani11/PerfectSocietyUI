import { Guid } from "guid-typescript";
import { AcSubCategoriesModel } from "../models/AcSubCategoriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: AcSubCategoriesModel = {
  SocietyId: "",
  SubCategoryId: Guid.EMPTY,
  CategoryId: "",
  SubCategory: "",
  PartDetails: true,
  Sequence: 0,
  Active: true,

}

const url = '/api/AcSubCategories';


function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: AcSubCategoriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcSubCategoriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}
function getById(id: number, societyId: string) {
  return customAxios.get(`${url}/GetById/${id}/${societyId}`, axiosRetryConfig);
}
export const acSubcategorieService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getBySocietyId,
  getById,
};