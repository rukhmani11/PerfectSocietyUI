import { Guid } from "guid-typescript";
import { SocietyMemberJointHoldersModel } from "../models/SocietyMemberJointHoldersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyMemberJointHoldersModel = {
    SocietyMemberJointHolderId:Guid.EMPTY,
    SocietyMemberId:"",
    Name:"",
    MemberClassId:"",
    StartDate:null,
    EndDate:null,
    EnteranceFeePaidOn:null,
    Address:"",
    City:"",
    Pin:null,
    StateId:"",
    CountryCode:"",
    PhoneNo:"",
    OfficePhoneNo:"",
    MobileNo:"",
    EmailId:"",

};

const url = '/api/SocietyMemberJointHolders';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMemberJointHoldersModel) {
  
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMemberJointHoldersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function GetBySocietyMemberId(societyMemberId:string) {
  return customAxios.get(`${url}/GetBySocietyMemberId/${societyMemberId}`, axiosRetryConfig);
}

export const societyMemberJointHoldersService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  GetBySocietyMemberId,
};
