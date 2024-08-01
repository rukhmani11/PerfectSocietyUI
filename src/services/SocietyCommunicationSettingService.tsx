import { SocietyCommunicationSettingModel } from "../models/SocietyCommunicationSettingModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: SocietyCommunicationSettingModel = {
    SocietyCommunicationSettingId: "",
    SocietyId: "",
    IsCommunicationModuleActive: true,
    SmsAndEmailEndsOn: null,
    AllowToSendSmsAndEmailForGd: true,
    IsThirdPartySmsAndEmail: true,
    SmsUrl: "",
    EmailSetting: "",
    MaxFileSizeInMb: 0,
    IsToReplyAll: true,
    IsGroupDiscussionActive: true
};

const url = '/api/SocietyCommunicationSetting';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyCommunicationSettingModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyCommunicationSettingModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const SocietyCommunicationSettingService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};