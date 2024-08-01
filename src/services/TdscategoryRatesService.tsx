import { Guid } from "guid-typescript";
import { TdscategoryRatesModel } from "../models/TdscategoryRatesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: TdscategoryRatesModel = {
    TdscategoryRateId: Guid.EMPTY,
    TdscategoryId: "",
    FromDate: null,
    ToDate: null,
    CompanyRate: 0,
    NonCompanyRate: 0
};

const url = '/api/TdscategoryRates';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: TdscategoryRatesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: TdscategoryRatesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}

function getByTdsCategoryId(tdsCategoryId:string) {
    return customAxios.get(`${url}/GetByTdsCategoryId/${tdsCategoryId}`, axiosRetryConfig);
}

export const TdscategoryRatesService = {

    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getByTdsCategoryId,
};