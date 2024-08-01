import { Guid } from "guid-typescript";
import { TaxesModel } from "../models/TaxesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: TaxesModel = {
    TaxId: Guid.EMPTY,
    Tax: "",
    TaxRate: 0,
    Surcharge: 0,
    Cess: 0,
    HiEduCess: 0,
    TaxPerc: 0,
    RoundToPs: 0,
    AcHeadId: "",
};

const url = '/api/Taxes';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getSelectList() {
    return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function post(payload: TaxesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: TaxesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

export const taxesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getSelectList
};