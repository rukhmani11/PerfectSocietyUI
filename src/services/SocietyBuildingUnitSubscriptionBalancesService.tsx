import { Guid } from "guid-typescript";
import { SocietyBuildingUnitSubscriptionBalancesModel } from "../models/SocietyBuildingUnitSubscriptionBalancesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBuildingUnitSubscriptionBalancesModel = {
    SocietyBuildingUnitSubscriptionBalanceId: Guid.EMPTY,
    SocietyBuildingUnitId: "",
    SocietySubscriptionId: "",
    BillAbbreviation: "",
    PrincipalAmount: null,
    InterestAmount: null,
    PrincipalReceipt: null,
    InterestReceipt: null,
    SpecialBillAmount: null,
    SpecialBillReceipt: null,
    TaxAmount: null,
    TaxReceipt: null,
    Advance: null,
    SocietyMemberId: "",
    AdvanceAdjusted: null,
};

const url = '/api/SocietyBuildingUnitSubscriptionBalances';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: SocietyBuildingUnitSubscriptionBalancesModel) {
    
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitSubscriptionBalancesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
  }
  function getBySocietyBuildingUnitId(societyBuildingUnitId: string) {
    return customAxios.get(`${url}/GetBySocietyBuildingUnitId/${societyBuildingUnitId}`, axiosRetryConfig);
}
function getForForm(societyBuildingUnitId: string, societySubscriptionId: string) {
    return customAxios.get(`${url}/GetForForm/${societyBuildingUnitId}/${societySubscriptionId}`, axiosRetryConfig);  
}
function getBySocietyBuildingUnitOpeningBalancesForSocietyBuildingUnitIDWithBillReceiptExistCheck(societyBuildingUnitId: string) {
    return customAxios.get(`${url}/GetBySocietyBuildingUnitOpeningBalancesForSocietyBuildingUnitIDWithBillReceiptExistCheck/${societyBuildingUnitId}`, axiosRetryConfig);  
}
export const SocietyBuildingUnitSubscriptionBalancesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getBySocietyBuildingUnitId,
    getForForm,
    getBySocietyBuildingUnitOpeningBalancesForSocietyBuildingUnitIDWithBillReceiptExistCheck,
};