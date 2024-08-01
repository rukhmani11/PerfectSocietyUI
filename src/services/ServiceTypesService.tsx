import { ServiceTypesModel } from "../models/ServiceTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: ServiceTypesModel = {
  ServiceTypeId: "",
  ServiceType: "",
  Mandatory: true,
  Chargeability: "",
  Basis: "",
  ChargeabilityBasis: "",
  Nature: "",
  Sequence: 0
};

const url = '/api/ServiceTypes';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: ServiceTypesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: ServiceTypesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const ServiceTypesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
