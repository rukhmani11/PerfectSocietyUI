import { SocietySpecialBillUnitsModel } from "../models/SocietySpecialBillUnitsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySpecialBillUnitsModel = {
  SocietySpecialBillId: "",
  SocietyBuildingUnitId: "",
};

const url = '/api/SocietySpecialBillUnits';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietySpecialBillUnitsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySpecialBillUnitsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(societySpecialBillId:string, societyBuildingUnitId: string) {
  return customAxios.delete(`${url}/${societySpecialBillId}/${societyBuildingUnitId}`, axiosRetryConfig);
}

function getBySocietySpecialBillId(societySpecialBillId: string) {
  return customAxios.get(`${url}/GetBySocietySpecialBillId/${societySpecialBillId}`, axiosRetryConfig);
}

export const societySpecialBillUnitsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getBySocietySpecialBillId
};
