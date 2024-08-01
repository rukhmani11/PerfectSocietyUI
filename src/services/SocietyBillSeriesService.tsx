import { SocietyBillSeriesModel } from "../models/SocietyBillSeriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBillSeriesModel = {
    SocietyId: "",
    BillAbbreviation: "",
    TaxId: "",
    BillingFrequency: "",
    BillDay: null,
    DueDays: 0,
    Terms: "",
    Note: "",
    PrintArea: true,
    InterestRate: 0,
    MinimumInterest: 0,
    Osadjustment: "A",
    NonOccupancyCharges: null,
    ChargeBillingCycleOrActualDate: "",
    InterChargeFromBillDateOrDueDate: ""
};

const url = '/api/SocietyBillSeries';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBillSeriesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBillSeriesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(st: string) {
    return customAxios.delete(`${url}/${st}`, axiosRetryConfig);
}

function getBySocietySubscriptionId(societySubscriptionId: string) {
    return customAxios.get(`${url}/GetBySocietySubscriptionId/${societySubscriptionId}`, axiosRetryConfig);
}

function getBySocietyIdAndAbbr(societyId: string, abbr: string) {
    //here abbr can be encodeURIComponent
    
    return customAxios.get(`${url}/GetBySocietyIdAndAbbr/${societyId}/${encodeURIComponent(abbr)}`, axiosRetryConfig);
}

function getSelectListBySocietyId(societyId:string){
    return customAxios.get(`${url}/GetSelectListBySocietyId/${societyId}`, axiosRetryConfig);
}

export const societyBillSeriesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getBySocietySubscriptionId,
    getBySocietyIdAndAbbr,
    getSelectListBySocietyId
};