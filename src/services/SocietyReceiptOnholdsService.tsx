import { SocietyReceiptOnholdsModel } from "../models/SocietyReceiptOnholdsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyReceiptOnholdsModel = {
    SocietyReceiptOnholdId: "",
    SocietyId: "",
    SocietyBuildingUnitId: "",
    SocietyMemberId: "",
    SocietySubscriptionId: "",
    ReceiptDate: null,
    BillAbbreviation: "",
    Amount: 0,
    TransactionId: "",
    PaidByPg: "",
    IsReceiptCreated: true,
    ReceiptCreatedOn: null
}

const url = '/api/SocietyReceiptOnholds';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyReceiptOnholdsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyReceiptOnholdsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyReceiptOnholdsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};