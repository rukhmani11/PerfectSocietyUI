import { SocietyLocalServicesModel } from "../models/SocietyLocalServicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyLocalServicesModel = {
    SocietyLocalServicesId: "",
    SocietyId: "",
    SocietyServiceName: ""
};

const url = '/api/SocietyLocalServices';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyLocalServicesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyLocalServicesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyLocalServicesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};