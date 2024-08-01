import { Guid } from "guid-typescript";
import { TdscategoriesModel } from "../models/TdscategoriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: TdscategoriesModel = {
    TdscategoryId: Guid.EMPTY,
    Tdscategory: "",
    AcHeadId: "",
    Section: ""
};

const url = '/api/Tdscategories';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getSelectList() {
    return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function post(payload: TdscategoriesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: TdscategoriesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {

    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

export const TdscategoriesService = {
    initialFieldValues,
    getAll,
    getSelectList,
    post,
    put,
    remove,
    getById,
};