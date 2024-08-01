import { SocietyVisitorGuestEntriesModel } from "../models/SocietyVisitorGuestEntriesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyVisitorGuestEntriesModel = {
    SocietyVisitorGuestEntriesId: "",
    VisitorName: "",
    MobileNumber : "",
    NumberOfVisitors : 0,
    VehicleNumber: "",
    Remarks: "",
    VisitType: "",
    VisitStatus: "",
    WelcomeCode: "",
    PlannedDateTime: null,
    VisitorInDateTime: null,
    VisitorOutDateTime: null,
    VisitToUserId: "",
    SocietyId: "",
    VisitToUserType: "",
    VisitToUserTypeUserId: "",
    VisitToSocietyBuildingUnitId: "",
};

const url = '/api/SocietyVisitorGuestEntries';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyVisitorGuestEntriesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyVisitorGuestEntriesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyVisitorGuestEntriesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};
