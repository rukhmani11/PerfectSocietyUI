import { CommunicationRepliesModel } from "../models/CommunicationRepliesModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CommunicationRepliesModel = {
    CommunicationReplyId:"",
    CommunicationId:"",
    BySocietyMemberId:"",
    Reply:"",
    BySocietyMemberTenantId:"",
    BySocietyUserId:"",
};
const url = '/api/CommunicationRecipients';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: CommunicationRepliesModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CommunicationRepliesModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const communicationRepliesService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
};