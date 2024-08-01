import { SocietyBuildingUnitTenantMappingsModel } from "../models/SocietyBuildingUnitTenantMappingsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBuildingUnitTenantMappingsModel = {
    SocietyBuildingUnitTenantMappingId: "",
    SocietyBuildingUnitId: "",
    SocietyMemberTenantId: "",
    PossessionStartDate: null,
    PossessionEndDate: null,
    Remarks: "",
    OccupancyFee: 0,
    PaymentDetails: "",
    AcHeadId: "",
    Particulars: "",
    PayModeCode: "",
    PayRefNo: "",
    PayRefDate: null,
    BankId: "",
    Branch: "",
    ActionStatus: "",
    ActionTakenById: "",
    ActionTakenByName: "",
    ActionTakenOn: null,
};

const url = '/api/SocietyBuildingUnitTenantMappings';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingUnitTenantMappingsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitTenantMappingsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyBuildingUnitTenantMappingsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};