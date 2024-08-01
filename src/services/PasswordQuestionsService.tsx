import { Guid } from "guid-typescript";
import { PasswordQuestionModel } from "../models/PasswordQuestionsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const initialFieldValues: PasswordQuestionModel = {
  PasswordQuestionId: Guid.EMPTY,
  PasswordQuestion: "",
  Active: true
};

const url = '/api/PasswordQuestions';

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: PasswordQuestionModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: PasswordQuestionModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
  
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

export const PasswordQuestionsService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
};
