import { CouponsModel } from "../models/CouponsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CouponsModel = {
    CouponNo:"",
    Ipin:"",
    DiscountPerc: 0,
    DiscountAmount:0,
    ValidityStart:null,
    ValidityEnd:null,
    MinAmount:0,
    MaxAmount:0,
    SubscriberId:"",
    SocietyId:""
};

const url = '/api/Countries';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: CouponsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CouponsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const CouponsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};