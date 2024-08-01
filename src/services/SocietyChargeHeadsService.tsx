import { Guid } from "guid-typescript";
import { SocietyChargeHeadsModel } from "../models/SocietyChargeHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyChargeHeadsModel = {
    SocietyId: "",
    ChargeHeadId: Guid.EMPTY,
    ChargeHead: "",
    AcHeadId: "",
    Nature: "",
    Rate: 0,
    Sequence: 0,
    BillAbbreviation: "",
    ChargeInterest: false,
    ChargeTax: false,
    Hsncode: "",
    MonthlyCharge: false,
};

const url = '/api/SocietyChargeHeads';

function getById(id: string, societyId: string) {
    return customAxios.get(`${url}/GetById/${id}/${societyId}`, axiosRetryConfig);
}

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyChargeHeadsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyChargeHeadsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: any) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getSelectListBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

export const societyChargeHeadsService = {
    initialFieldValues,
    getById,
    getAll,
    post,
    put,
    remove,
    getSelectListBySocietyId,
    getBySocietyId,
};