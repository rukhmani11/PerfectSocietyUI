import { SocietyMemberTenantDependentsModel } from "../models/SocietyMemberTenantDependentsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyMemberTenantDependentsModel={
    SocietyMemberTenantDependentId: "",
    SocietyBuildingUnitTenantMappingId : "",
    Name : "",
    RelationshipId : "",
    Address : "",
    City: "",
    Pin : 0,
    StateId : "",
    CountryCode : "",
    PhoneNo: "",
    OfficePhoneNo : "",
    MobileNo : "",
    EmailId: "",
}


const url = '/api/SocietyMemberTenantDependents';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMemberTenantDependentsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMemberTenantDependentsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const SocietyMemberTenantDependentsService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};