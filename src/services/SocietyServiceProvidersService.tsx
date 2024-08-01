import { SocietyServiceProvidersModel } from "../models/SocietyServiceProvidersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyServiceProvidersModel={
    SocietyServiceProvidersId:"",
    SocietyId:"",
    SocietyLocalServicesId:"",
    ServiceProviderNumber:"",
    PersonName:"",
    Gender:"",
    MobileNumber:"",
    Address:"",
    AadharNumber:"",
    Active:true,
    IsBanned:true,
}
const url = '/api/SocietyServiceProviders';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyServiceProvidersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyServiceProvidersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyServiceProvidersService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};