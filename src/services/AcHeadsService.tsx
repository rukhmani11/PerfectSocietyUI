import { Guid } from "guid-typescript";
import { AcHeadsModel } from "../models/AcHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: AcHeadsModel = {
  AcHeadId: Guid.EMPTY,
    SocietyId: "",
    AcHead: "",
    SubCategoryId: "",
    Sequence: 0,
    Nature: "",
    TdscategoryId: "",
    Tdscompany: true,
    Pan: "",
    Address: "",
    City: "",
    Pin: 0,
    StateId: "",
    CountryCode: "",
    Active: true,
    GstNo: "",
};
const url = '/api/AcHeads';
function getSelectListBySocietyId(societyId:string) {
  return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: AcHeadsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: AcHeadsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
function getSelectListBySocietyIDNature(societyId:string, nature: string) {
  // let nature="D";
  return customAxios.get(`${url}/ListBySocietyIDNature/${societyId}/${nature}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}
function getById(id: number,societyId: string) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getByIdAndSocietyId(id: number,societyId: string) {
  return customAxios.get(`${url}/GetByIdAndSocietyId/${id}/${societyId}`, axiosRetryConfig);
}

export const acHeadsService = {
  initialFieldValues,
  getSelectListBySocietyId,
  getAll,
  post,
  put,
  remove,
  getSelectList,
  getSelectListBySocietyIDNature,
  getBySocietyId,
  getById,
  getByIdAndSocietyId
};