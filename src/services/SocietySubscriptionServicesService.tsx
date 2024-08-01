import { SocietySubscriptionServicesModel } from "../models/SocietySubscriptionServicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietySubscriptionServicesModel={
    SocietySubscriptionServiceId:"",
    SocietySubscriptionId:"",
    ServiceTypeId:"",
    ActiveStatus:"",
}
const url = '/api/SocietySubscriptionServices';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietySubscriptionServicesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySubscriptionServicesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societySubscriptionServicesService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};