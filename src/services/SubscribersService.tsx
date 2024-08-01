import { Guid } from "guid-typescript";
import { SubscribersModel } from "../models/SubscribersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SubscribersModel = {
  SubscriberId: Guid.EMPTY,
  Subscriber: "",
  Abbreviation: "",
  Address: "",
  City: "",
  Pin: 0,
  StateId: "",
  CountryCode: "",
  ContactPerson: "",
  Phone: "",
  Mobile: "",
  Active: true,
  //States : []
  Email:"",
  UserName:"",
  Password:"",
  ConfirmPassword:""
};
const url = '/api/Subscribers';

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: SubscribersModel) {
  
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SubscribersModel) {
  
  // return customAxios.put(`${url}/Edit`, JSON.stringify(payload, replacer), axiosRetryConfig);
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const subscriberService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
};