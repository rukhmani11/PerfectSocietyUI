import { Guid } from "guid-typescript";
import { SocietySpecialBillsModel } from "../models/SocietySpecialBillsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySpecialBillsModel = {
  SocietySpecialBillId: Guid.EMPTY,
  SocietyId: "",
  UnitTypeId: "",
  SocietyBuildingUnitId: "",
  FromDate: null,
  ToDate: null,
  Remark: "",
};

const url = '/api/SocietySpecialBills';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getById(id: string) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

function post(payload: SocietySpecialBillsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySpecialBillsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSocietySpecialBills(societyId: string,showRunning:boolean) {
  return customAxios.get(`${url}/SocietySpecialBills/${societyId}/${showRunning}`, axiosRetryConfig);
}

export const societySpecialBillsService = {
  initialFieldValues,
  getBySocietyId,
  getById,
  getAll,
  post,
  put,
  remove,
  getSocietySpecialBills,
};
