import { SocietySubscriptionInvoiceServicesModel } from "../models/SocietySubscriptionInvoiceServicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySubscriptionInvoiceServicesModel = {
    SocietySubscriptionInvoiceId: "",
    ServiceTypeId: "",
    Amount: 0,
};

const url = '/api/SocietySubscriptionInvoiceServices';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietySubscriptionInvoiceServicesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySubscriptionInvoiceServicesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietySubscriptionInvoiceServicesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};