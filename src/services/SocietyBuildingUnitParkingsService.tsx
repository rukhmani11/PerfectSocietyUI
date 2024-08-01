import { Guid } from "guid-typescript";
import { SocietyBuildingUnitParkingsModel } from "../models/SocietyBuildingUnitParkingsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBuildingUnitParkingsModel = {
    SocietyBuildingUnitParkingId: Guid.EMPTY,
    SocietyParkingId: "",
    SocietyBuildingUnitId: "",
    SocietyMemberId: "",
    SocietyMemberTenantId: "",
    TransferredOn: null,
    EndDate: null,
    VehicleNumber:"",
}

const url = '/api/SocietyBuildingUnitParkings';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function getById(id: string) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function post(payload: SocietyBuildingUnitParkingsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitParkingsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBysocietyBuildingUnitId(societyBuildingUnitId: string) {
    return customAxios.get(`${url}/GetBySocietyParkingId/${societyBuildingUnitId}`, axiosRetryConfig);
}

function GetMaxTransfredONDateBySocietyParkingId(SocietyParkingId: Guid) {
    return customAxios.get(`${url}/GetMaxTransfredONDateBySocietyParkingId/${SocietyParkingId}`, axiosRetryConfig);
}
export const SocietyBuildingUnitParkingsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getBysocietyBuildingUnitId,
    GetMaxTransfredONDateBySocietyParkingId,
 };