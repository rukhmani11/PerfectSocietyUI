import { SocietySubscriptionInvoicesModel } from "../models/SocietySubscriptionInvoicesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySubscriptionInvoicesModel = {
    SocietySubscriptionInvoiceId: "",
    SocietySubscriptionId: "",
    NoOfMembers: 0,
    SubscribedMonths: 0,
    Amount: 0,
    SubscriptionInvoiceId: "",
};

const url = '/api/SocietySubscriptionInvoices';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietySubscriptionInvoicesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySubscriptionInvoicesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietySubscriptionInvoicesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};