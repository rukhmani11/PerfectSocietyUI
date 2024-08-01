import { CommunicationRecipientModel } from "../models/CommunicationRecipientModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CommunicationRecipientModel = {
  CommunicationRecipientId: "",
  CommunicationId: "",
  SocietyMemberId: "",
  SocietyMemberTenantId: "",
  SocietyUserId: "",
};
const url = '/api/CommunicationRecipients';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: CommunicationRecipientModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CommunicationRecipientModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const communicationrecipientService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};