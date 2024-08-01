import { Guid } from "guid-typescript";
import { SocietySpecialBillChargeHeadsModel } from "../models/SocietySpecialBillChargeHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySpecialBillChargeHeadsModel = {
    SocietySpecialBillChargeHeadId: Guid.EMPTY,
    SocietySpecialBillId: "",
    ChargeHeadId: "",
    Rate: 0,
};

const url = '/api/SocietySpecialBillChargeHeads';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietySpecialBillChargeHeadsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySpecialBillChargeHeadsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getBySocietySpecialBillId(societySpecialBillId: string) {
  return customAxios.get(`${url}/GetBySocietySpecialBillId/${societySpecialBillId}`, axiosRetryConfig);
}

export const societySpecialBillChargeHeadsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  getBySocietySpecialBillId
};
