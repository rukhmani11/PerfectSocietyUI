import { SocietyServiceProviderVisitsModel } from "../models/SocietyServiceProviderVisitsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyServiceProviderVisitsModel={
    SocietyServiceProviderVisitsId:"",
    SocietyServiceProvidersId:"",
    VisitToUserId:"",
    VisitStatus:"",
     InDateTime:null,
     OutDateTime:null,
    SocietyId:"",
}
const url = '/api/SocietyServiceProviderVisits';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyServiceProviderVisitsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyServiceProviderVisitsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyServiceProviderVisitsService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};