import { SmssModel } from "../models/SmssModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SmssModel = {
    SmssId: "",
    Smstype: "",
    Smsmessage: "",
    DltEnglishId: "",
    Smsinfo: ""
};

const url = '/api/Smss';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SmssModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}


function put(payload: SmssModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SmssService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};