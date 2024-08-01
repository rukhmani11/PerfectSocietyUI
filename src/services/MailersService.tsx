import { MailerModel } from "../models/MailersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { Guid } from 'guid-typescript';

const initialFieldValues: MailerModel = {
    MailerId:Guid.EMPTY,
    MailType:"",
    Subject:"",
    MailTo:"",
    MailCc:"",
    Message:"",
    Attachment:"",
  };
  const url = '/api/Mailers';

  function post(payload: MailerModel) {
      return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
    }
    
    function put(payload: MailerModel) {
        return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
    }
    
    function getAll() {
      return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
    }
  function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
  }
  function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
  }
  export const mailerService = {
    initialFieldValues,
    post,
    put,
    getAll,
    remove,
    getById,
  };