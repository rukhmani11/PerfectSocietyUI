import { LocalServicesModel } from "../models/LocalServicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: LocalServicesModel = {
    LocalServicesId: "",
    ServiceName: "",
};

const url = '/api/LocalServices';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: LocalServicesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: LocalServicesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const LocalServicesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};