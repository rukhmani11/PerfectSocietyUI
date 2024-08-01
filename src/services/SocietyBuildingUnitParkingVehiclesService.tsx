import { SocietyBuildingUnitParkingVehiclesModel } from "../models/SocietyBuildingUnitParkingVehiclesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyBuildingUnitParkingVehiclesModel = {
    SocietyBuildingUnitParkingVehicleId: "",
    SocietyBuildingUnitParkingId: "",
    VehicleNumber: "",
    AllocatedFrom: null,
    AllocatedTo: null,
}

const url = '/api/SocietyBuildingUnitParkingVehicles';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingUnitParkingVehiclesModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitParkingVehiclesModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyBuildingUnitParkingVehiclesService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};