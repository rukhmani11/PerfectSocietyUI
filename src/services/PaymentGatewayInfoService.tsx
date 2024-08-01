import { PaymentGatewayInfoModel } from "../models/PaymentGatewayInfoModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: PaymentGatewayInfoModel = {
    PaymentGatewayInfoId: "",
    GatewayName: "",
    Charges: "",
    LogoPath: "",
    Active: true,
    SequenceNo: 0
};

const url = '/api/PaymentGatewayInfo';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: PaymentGatewayInfoModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: PaymentGatewayInfoModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const PaymentGatewayInfoService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};