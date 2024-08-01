import { Guid } from "guid-typescript";
import { UomsModel } from "../models/UomsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: UomsModel = {
    Uomid: Guid.EMPTY,
    Uom: "",
    Active: true
};

const url = '/api/Uoms';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: UomsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: UomsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
  
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
  }
  function getSelectList() {
    return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
  }


export const uomsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getSelectList,
    getById,
};