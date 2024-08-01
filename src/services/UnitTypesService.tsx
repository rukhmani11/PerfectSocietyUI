import { Guid } from "guid-typescript";
import { UnitTypesModel } from "../models/UnitTypesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: UnitTypesModel = {
    UnitTypeId: Guid.EMPTY,
    UnitType: "",
    Active: true
};

const url = '/api/UnitType';

function getSelectList() {
    return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
  }

function getById(id: number) {
    return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
  }

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: UnitTypesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: UnitTypesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const unitTypesService = {
    initialFieldValues,
    getSelectList,
    getById,
    getAll,
    post,
    put,
    remove,
};