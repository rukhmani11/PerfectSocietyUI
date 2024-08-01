import { Guid } from "guid-typescript";
import { StandardAcHeadsModel } from "../models/StandardAcHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardAcHeadsModel = {
  AcHeadId:Guid.EMPTY,
  AcHead: "",
  SubCategoryId: "",
  Sequence: 0,
  Nature: "",
  TdscategoryId: "",
  Tdscompany: true,
};

const url = '/api/StandardAcHeads';

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardAcHeadsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardAcHeadsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function GetBySubCategoryid(UserId: string) {
  return customAxios.get(`${url}/GetBySubCategoryid/${UserId}`, axiosRetryConfig);
}

function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

export const standardAcHeadsService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
  GetBySubCategoryid,
  getSelectList
};
