import { CommunicationsModel } from "../models/CommunicationsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: CommunicationsModel = {
    CommunicationId: "",
    SocietyId: "",
    FromSocietyMemberId: "",
    CommunicationTypeId: "",
    Subject: "",
    Details: "",
    Published: true,
    LastUpdate: null,
    Replies: 0,
    Closed: true,
    TicketNumber: 0,
    ClosedOn: null,
    ClosedBySocietyMemberId: "",
    ApprovedBySocietyMemberId: "",
    ApprovedOn: null,
    FromSocietyMemberTenantId: "",
    FromSocietyUserId: "",
};

const url = '/api/Communications';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: CommunicationsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: CommunicationsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

export const CommunicationsService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
};
