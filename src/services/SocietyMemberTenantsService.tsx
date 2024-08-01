import { SocietyMemberTenantsModel } from "../models/SocietyMemberTenantsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyMemberTenantsModel={
    SocietyMemberTenantId: "",
    SocietyId: "",
    FolioNo: 0,
    Tenant: "",
    StartDate: null,
    EndDate : null,
    Address: "",
    City: "",
    StateId: "",
    Pin: 0,
    CountryCode: null,
    PhoneNo: "",
    OfficePhoneNo: "",
    MobileNo: "",
    EmailId: "",
    IsActive: true,
    ApprovedById: "",
    ApprovedByName: "",
    ApprovedOn: null,
}


const url = '/api/SocietyMemberTenants';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMemberTenantsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMemberTenantsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const SocietyMemberTenantsService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};