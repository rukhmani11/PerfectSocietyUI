import { SocietyPayModesModel } from "../models/SocietyPayModesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyPayModesModel={
    SocietyId:"",
    PayModeCode:"",
    PayMode:"",
    AskDetails:true,
    Active:true,
    AcHeadId:"",
    BankId:"",
    BranchName:"",
    Ifsc:"",
    BankAccountNo:0,
    BankAddress:"",
    IsForPayInSlip:true,
}
const url = '/api/SocietyPayModes';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyPayModesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyPayModesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

function getBySocietyIdAndPMCode(societyId: string, pmCode: string) {
  return customAxios.get(`${url}/GetBySocietyIdAndPMCode/${societyId}/${pmCode}`, axiosRetryConfig);
}

function getBySocietySelectListId(societyId:string){
    return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

export const societyPayModesService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getBySocietyId,
    getBySocietyIdAndPMCode,
    getBySocietySelectListId,
};