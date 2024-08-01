import { Guid } from "guid-typescript";
import { StandardChargeHeadsModel } from "../models/StandardChargeHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: StandardChargeHeadsModel = {
  ChargeHeadId: Guid.EMPTY,
  ChargeHead: "",
  ChargeInterest: true,
  ChargeTax: true,
  AcHeadId: "",
  Nature: "",
  Sequence: 0,
  Hsncode: "",
  Rate:0,
};

const url = "/api/StandardChargeHeads";

function getById(id: number) {
  return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: StandardChargeHeadsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: StandardChargeHeadsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const standardChargeHeadsService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
};
