import { CountriesModel } from "../models/CountriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CountriesModel = {
    CountryCode: "",
    Country: "",
};

const url = '/api/Countries';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getSelectList() {
    return customAxios.get(`${url}/GetSelectList`, axiosRetryConfig);
}

function post(payload: CountriesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CountriesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const countriesService = {
    initialFieldValues,
    getAll,
    getSelectList,
    post,
    put,
    remove,
};