import { SocietyBillChargeHeadsModel } from "../models/SocietyBillChargeHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBillChargeHeadsModel = {
    SocietyBillId: "",
    ChargeHeadId: "",
    Amount: 0
};

const url = '/api/SocietyBillChargeHeads';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBillChargeHeadsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBillChargeHeadsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getSocietyBillChargeHeadsBySocietyBillId(societyBillId:string) {
    
    return customAxios.get(`${url}/GetSocietyBillChargeHeadsBySocietyBillId/${societyBillId}`, axiosRetryConfig);
}

export const societyBillChargeHeadsService = {

    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getSocietyBillChargeHeadsBySocietyBillId,
};