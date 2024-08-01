import { SocietyParametersModel } from "../models/SocietyParametersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyParametersModel={
    SocietyParametersId:"",
    SocietyId:"",
    IsTenantModuleActive:true,
    IsTenantApprovalProcessActive:true,
    IsOffRecCommActive:true,
}
const url = '/api/SocietyParameters';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyParametersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyParametersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyParametersService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};