import { SocietyVisitorVehicleEntriesModel } from "../models/SocietyVisitorVehicleEntriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyVisitorVehicleEntriesModel = {
    SocietyVisitorVehicleEntriesId: "",
    VehicleNumber: "",
    Company: "",
    DriverName: "",
    MobileNumber: "",
    Remarks: "",
    VisitType: "",
    VisitStatus: "",
    WelcomeCode: "",
    PlannedDateTime: null,
    VisitorInDateTime: null,
    VisitorOutDateTime: null,
    VisitToUserId: "",
    SocietyId: "",
    VisitToSocietyBuildingUnitId: "",
    VisitToUserType: "",
    VisitToUserTypeUserId: "",
};

const url = '/api/SocietyVisitorVehicleEntries';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyVisitorVehicleEntriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyVisitorVehicleEntriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyVisitorVehicleEntriesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
