import { SocietyNotificationsModel } from "../models/SocietyNotificationsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues:SocietyNotificationsModel={
    SocietyNotificationsId:"",
    MessageToUserId:"",
    SocietyId:"",
    NotificationText:"",
    //ReadOn: Date;
    MessageToSocietyBuildingUnitId:"",
    MessageToUserType:"",
    MessageToUserTypeUserId:"",
    MessageFromSocietyBuildingUnitId:"",  
}
const url = '/api/SocietyNotifications';

function post(payload: SocietyNotificationsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
  }
  
export const societyNotificationsService={
    initialFieldValues,
    post,
};