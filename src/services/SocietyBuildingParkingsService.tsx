import { SocietyBuildingParkingsModel } from "../models/SocietyBuildingParkingsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBuildingParkingsModel = {
    SocietyBuildingParkingId: "",
    SocietyBuildingId: "",
    ParkingNo: "",
    ParkingTypeId: "",
};

const url = '/api/SocietyBuildingParkings';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingParkingsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingParkingsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyBuildingParkingsService = {

    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};