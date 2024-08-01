import { Guid } from "guid-typescript";
import { RelationshipsModel } from "../models/RelationshipsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: RelationshipsModel = {
  RelationshipId: Guid.EMPTY,
  Relationship: "",
  Active: true,
};
const url = '/api/Relationships';

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function post(payload: RelationshipsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}
function put(payload: RelationshipsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSelectList() {
  return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}
export const RelationshipsService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
  getSelectList,
};
