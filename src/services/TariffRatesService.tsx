import { TariffRatesModel } from "../models/TariffRatesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: TariffRatesModel = {
  TariffRateId: "",
  TariffId: "",
  ServiceTypeId: "",
  Rate: 0,
};

const url = '/api/TariffRates';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: TariffRatesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: TariffRatesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const TariffRatesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};