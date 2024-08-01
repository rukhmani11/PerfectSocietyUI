import { Guid } from "guid-typescript";
import { SocietyMemberNomineesModel } from "../models/SocietyMemberNomineesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyMemberNomineesModel = {
    SocietyMemberNomineeId: Guid.EMPTY,
    SocietyMemberId:"",
    Name:"",
    RelationshipId:"",
    BirthDate:null,
    RevocationDate:null,
    Mcmdate:null,
    NominationDate:null,
    Relationship:"",
    Address:"",
    City:null,
    Pin:"",
    StateId :"",
    CountryCode:"",
    PhoneNo:"",
    OfficePhoneNo:"",
    MobileNo:"",
    EmailId:"",
    NominationPerc:null,

};

const url = '/api/SocietyMemberNominees';

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMemberNomineesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMemberNomineesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function GetBySocietyMemberId(societyMemberId:string) {
  return customAxios.get(`${url}/GetBySocietyMemberId/${societyMemberId}`, axiosRetryConfig);
}

export const SocietyMemberNomineesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  GetBySocietyMemberId
};
