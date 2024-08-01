import { SocietyServiceProviderUsersModel } from "../models/SocietyServiceProviderUsersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyServiceProviderUsersModel={
    SocietyServiceProviderUsersId:"",
    SocietyServiceProvidersId:"",
    UserId:"",
    Active:true,

}
const url = '/api/SocietyServiceProviderUsers';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyServiceProviderUsersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyServiceProviderUsersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyServiceProviderUsersService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};