import React from "react";
import { ResetPasswordModel, UserModel } from "../models/UserModel";
//import { globalService } from "./GlobalService";
//import http, { HttpResponse } from "./AxiosHttpCommon";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { AuthContext } from "../utility/context/AuthContext";

const initialFieldValues: UserModel = {
  UserId: "-1",
  FirstName: "",
  LastName: "",
  Email: "",
  PhoneNumber: 0,
  Password: "",
  ConfirmPassword: "",
  UserName: "",
  Roles: [],
  SocietyId: "",
};

const initialResetPasswordFieldValues: ResetPasswordModel = {
  UserId: "",
  Password: "",
  ConfirmPassword: "",

};

const url = '/api/account';
// const formatData = (data: UserModel) => ({
//   ...data,
//   Age: data.Age ? parseInt(data.Age) : 0,
// });

function get(id: number) {
  return customAxios.get(`${url}/GetUser/${id}`, axiosRetryConfig);
}

function getBySocietyId(societyId: string) {
  
  return customAxios.get(`${url}/GetBySocietyId/${societyId}`, axiosRetryConfig);
}

function getExceptSocietyUsers() {
  
  return customAxios.get(`${url}/GetExceptSocietyUsers`, axiosRetryConfig);
}

function post(payload: UserModel) {
  //let f_payload = formatData(payload);
  return customAxios.post(`${url}/Register`, payload, axiosRetryConfig);
}

function put(payload: UserModel) {
  //return customAxios.put(`${url}/UpdateUser`, payload);
  return customAxios.put(`${url}/UpdateUser`, payload, axiosRetryConfig);
}

function remove(userName: string, societyId: string) {
  if (societyId)
    return customAxios.delete(`${url}/DeleteUser?username=${userName}&&societyId=${societyId}`, axiosRetryConfig);
  else
    return customAxios.delete(`${url}/DeleteUser?username=${userName}`, axiosRetryConfig);
}

function removeAll() {
  return customAxios.delete(`${url}/user`, axiosRetryConfig);
}

function login(payload: any) {
  return customAxios.post(`${url}/login`, payload, axiosRetryConfig);
}

function getRolesMultiSelect() {
  return customAxios.get(`${url}/GetRolesMultiSelect`, axiosRetryConfig);
}

function getAllRoleSelectList() {
  return customAxios.get(`${url}/GetAllRoles`, axiosRetryConfig);
}

function useAuth() {
  const { auth } = React.useContext(AuthContext);
  return auth;
}

function ResetPassword(payload: ResetPasswordModel) {
  return customAxios.put(`${url}/ResetPassword`, payload, axiosRetryConfig);
}


export const userService = {
  initialFieldValues,
  initialResetPasswordFieldValues,
  get,
  getBySocietyId,
  getExceptSocietyUsers,
  post,
  put,
  remove,
  removeAll,
  login,
  useAuth,
  getAllRoleSelectList,
  getRolesMultiSelect,
  ResetPassword
};
