import { AdvertisementsModel } from "../models/AdvertisementsModel";
import { config } from "../utility/Config";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { Guid } from 'guid-typescript';

const initialFieldValues: AdvertisementsModel = {
    AdvertisementId:Guid.EMPTY,
    AdvHeading: "", 
    AdvInfo: "",
    AdvUrl: "",
    AdvSequence: null,
    Active: false,
    AdvImageName: "",
};
const url = '/api/Advertisements';

function getAll() {
    
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}
function post(payload: AdvertisementsModel,AdvertisementlogoFile:File) {
  const formData = new FormData();
  if (AdvertisementlogoFile != null) {
    
    formData.append("AdvertisementlogoFile", AdvertisementlogoFile);
}
formData.append("data", JSON.stringify(payload));
return customAxios.post(
    `${url}/Add`,
    formData,
    config.formDataConfig
);
}

function put(payload: AdvertisementsModel, AdvertisementlogoFile: File) {
  const formData = new FormData();
  if (AdvertisementlogoFile != null) {
      formData.append("AdvertisementlogoFile", AdvertisementlogoFile);
  }
  formData.append("data", JSON.stringify(payload));
  
  return customAxios.put(`${url}/Edit`, formData, config.formDataConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
  }
export const AdvertisementsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
};