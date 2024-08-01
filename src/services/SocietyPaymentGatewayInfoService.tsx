import { SocietyPaymentGatewayInfoModel } from "../models/SocietyPaymentGatewayInfoModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyPaymentGatewayInfoModel={
    SocietyPaymentGatewayInfoId:"",
    SocietyId:"",
    PaymentGatewayInfoId:"",
    PaymentGatewayLink:"",
    Active:true,
    SequenceNo:0,
}
const url = '/api/SocietyPaymentGatewayInfo';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyPaymentGatewayInfoModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyPaymentGatewayInfoModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
export const societyPaymentGatewayInfoService={
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};