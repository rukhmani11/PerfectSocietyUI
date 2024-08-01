import { Guid } from "guid-typescript";
import { SocietyInvestmentsModel } from "../models/SocietyInvestmentsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { debug } from "console";

const initialFieldValues: SocietyInvestmentsModel = {
    SocietyInvestmentId: Guid.EMPTY,
    SocietyId: "",
    BankId: "",
    Bank: "",
    DocumentNo: "",
    DocumentDate: null,
    MaturityDate: null,
    Amount: 0,
    InterestRate: 0,
    ChequeNo: "",
    ChequeDate: null,
    MaturityAmount: 0,
    ClosureDate: null,
    ClosureAmount: 0,
    RealizationDate: null
};

const url = '/api/SocietyInvestments';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyInvestmentsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyInvestmentsModel) {
    
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getSocietyInvestmentBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetSocietyInvestmentBySocietyId/${societyId}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
export const SocietyInvestmentsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getSocietyInvestmentBySocietyId,
    getById,
};