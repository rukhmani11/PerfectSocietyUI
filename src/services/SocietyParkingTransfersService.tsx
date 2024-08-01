import { SocietyParkingTransfersModel } from "../models/SocietyParkingTransfersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyParkingTransfersModel={
    SocietyParkingTransferId:"",
    SocietyParkingId:"",
    TransferredOn:null,
    SocietyMemberId:"",
    EndDate:null,
}
const url = '/api/SocietyParkingTransfers';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyParkingTransfersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyParkingTransfersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyParkingTransfersService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};