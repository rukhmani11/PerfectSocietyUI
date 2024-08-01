import { Guid } from "guid-typescript";
import { SocietyCollectionReversalsModel } from "../models/SocietyCollectionReversalsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyCollectionReversalsModel = {
    //SocietyCollectionReversalId :null ?? Guid.EMPTY,

    SocietyCollectionReversalId: Guid.EMPTY,
    SocietyReceiptId: "",
    SocietyId: "",
    SocietyBuildingUnitId: "",
    SocietyMemberId: "",
    SocietySubscriptionId: "",
    ReversalDate: null,
    AcYear: "",
    Serial: 0,
    BillAbbreviation: "",
    DocNo: "",
    PrincipalAdjusted: 0,
    InterestAdjusted: 0,
    NonChgAdjusted: 0,
    TaxAdjusted: 0,
    Advance: 0,
    Particulars: "",
    PayModeCode: "",
    PayRefNo: "",
    PayRefDate: null,
    BankId: "",
    Branch: "",
    AcTransactionId: "",
};

const url = '/api/SocietyCollectionReversals';

function getById(id: string) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyCollectionReversalsModel) {

    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyCollectionReversalsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}
function getForForm(societySubscriptionId: string) {
    return customAxios.get(`${url}/GetForForm/${societySubscriptionId}`, axiosRetryConfig);
}
function sendCollectionReversalEmail(payload: any) {
    return customAxios.post(`${url}/SendCollectionReversalEmail`, payload, axiosRetryConfig);
}

function getSocietySubscriptionDatesForCollectionReversal(societySubscriptionId: string, billAbbr: string) {
    return customAxios.get(`${url}/GetSocietySubscriptionDatesForCollectionReversal/${societySubscriptionId}/${billAbbr}`, axiosRetryConfig);
}

export const SocietyCollectionReversalsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getBySocietyId,
    getForForm,
    sendCollectionReversalEmail,
    getSocietySubscriptionDatesForCollectionReversal
};