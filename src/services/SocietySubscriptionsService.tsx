import { Guid } from "guid-typescript";
import { SocietySubscriptionsModel } from "../models/SocietySubscriptionsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietySubscriptionsModel = {
    SocietySubscriptionId: Guid.EMPTY,
    SocietyId: "",
    SubscriptionStart: null,
    SubscriptionEnd: null,
    NoOfMembers: null,
    NoOfInvoicedMembers: 0,
    NoOfAdditionalMembers: 0,
    InvoicedMonths: 0,
    SubscribedMonths: 0,
    PaidTillDate: null,
    PaidMonths: 0,
    Closed: false,
    LockedTillDate: null
};

const url = '/api/SocietySubscriptions';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function getById(id: any) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function post(payload: SocietySubscriptionsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietySubscriptionsModel) {
    
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

function getMaxOfEndDateAndNoOfMembersBySocietyId(societyId: string) {
    return customAxios.get(`${url}/GetMaxOfEndDateAndNoOfMembersBySocietyId/${societyId}`, axiosRetryConfig);
}

function createAcYearClosingEntry(societySubscriptionId: string) {
    return customAxios.get(`${url}/CreateAcYearClosingEntry/${societySubscriptionId}`, axiosRetryConfig);
}

function deleteAcYearClosingEntry(societySubscriptionId: string) {
    return customAxios.get(`${url}/DeleteAcYearClosingEntry/${societySubscriptionId}`, axiosRetryConfig);
}


function getCurrentSocietySubscription() {   
    if (localStorage.getItem("currentSocietySubscription")) {
        let currentSocietySubscription: SocietySubscriptionsModel = JSON.parse(localStorage.getItem("currentSocietySubscription"));
        return currentSocietySubscription;
    }
    return null;
}

export const societySubscriptionsService = {
    initialFieldValues,
    getAll,
    getById,
    post,
    put,
    remove,
    getBySocietyId,
    getMaxOfEndDateAndNoOfMembersBySocietyId,
    createAcYearClosingEntry,
    deleteAcYearClosingEntry,
    getCurrentSocietySubscription
  
};