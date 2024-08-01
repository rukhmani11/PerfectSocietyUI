import {
  SocietiesModel,
  SocietyParameterModel,
} from "../models/SocietiesModel";
import { config } from "../utility/Config";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { Guid } from "guid-typescript";

const initialFieldValues: SocietiesModel = {
  SocietyId: Guid.EMPTY,
  Society: "",
  Abbreviation: "",
  ShortName: "",
  RegistrationNo: "",
  RegistrationDate: null,
  Address: "",
  City: "",
  Pin: null,
  StateId: "",
  CountryCode: "",
  ContactPerson: "",
  Phone: "",
  Mobile: "",
  Builder: "",
  Architect: "",
  Signatory: "",
  Pan: "",
  Tan: "",
  TaxRegistrationNo: "",
  Capital: null,
  // UNoOfMembers: null,
  Uomid: Guid.EMPTY,
  AccountPosting: "",
  MemberAcHeadId: "",
  TransferFeeAcHeadId: "",
  UMinDate: null,
  UMaxDate: null,
  SubscriberId: "",
  Active: false,
  Sms: true,
  EmailId: "",
  TaxApplicable: false,
  ShowParticularsInReceipt: true,
  RazorPayMerchantId: "",
  RazorPayTestApikeyId: "",
  RazorPayTestKeySecret: "",
  RazorPayLiveapikeyId: "",
  RazorPayLivekeySecret: "",
  EnablePaymentGateway: false,
  EnableEmail: false,
  EnableSms: false,
  EnableSsdocsIntegration: false,
  QrcodeImageName: "",
  Upipay: "",
  EaseBuzzSubMerchantId: "",
  EnableMultilingual: false
};

const initialParameterFieldValues: SocietyParameterModel = {
  SocietyId: Guid.EMPTY,
  TaxApplicable: false,
  MemberAcHeadId: "",
  AccountPosting: ""
};

const url = "/api/Societies";

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietiesModel, QrcodeImage: File) {
  const formData = new FormData();
  if (QrcodeImage != null) {
    formData.append("QrcodeImage", QrcodeImage);
  }
  var replacer = function (key: any, value: any) {
    return typeof value === "undefined" || value === "" ? null : value;
  };
  formData.append("data", JSON.stringify(payload, replacer));
  return customAxios.post(`${url}/Add`, formData, config.formDataConfig);
}

function put(payload: SocietiesModel, QrcodeImage: File) {
  const formData = new FormData();
  if (QrcodeImage != null) {
    formData.append("QrcodeImage", QrcodeImage);
  }

  var replacer = function (key: any, value: any) {
    return typeof value === "undefined" || value === "" ? null : value;
  };

  formData.append("data", JSON.stringify(payload, replacer));
  return customAxios.put(`${url}/Edit`, formData, config.formDataConfig);
}

function deleteQRImage(id: string) {
  return customAxios.delete(`${url}/DeleteQRImage/${id}`, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getByUserId(userId: string) {
  return customAxios.get(`${url}/GetByUserId/${userId}`, axiosRetryConfig);
}

function getBySubscriberId(subscriberId: string) {
  return customAxios.get(
    `${url}/GetBySubscriberId/${subscriberId}`,
    axiosRetryConfig
  );
}

function activateOrDeActivate(payload: any) {
  return customAxios.put(
    `${url}/ActivateOrDeActivate`,
    payload,
    axiosRetryConfig
  );
}

function EditParametersDetails(payload: SocietyParameterModel) {
  return customAxios.put(
    `${url}/EditParametersDetails`,
    payload,
    axiosRetryConfig
  );
}

function clearSocietyAndSubscription(
  clearSociety: boolean,
  clearSubscription: boolean
) {
  if (clearSubscription) {
    localStorage.setItem("currentSocietySubscription", "");
    localStorage.setItem("societySubscriptionId", "");
  }
  if (clearSociety) {
    localStorage.setItem("societyId", "");
    localStorage.setItem("societyName", "");
  }
}

function clearStorageForIndex()
{
  //email and phone will not be deleted
  localStorage.setItem("currentUser", "");
  localStorage.setItem("token", "");
  localStorage.setItem("", "");
  localStorage.setItem("", "");

  localStorage.setItem("currentSocietySubscription", "");
  localStorage.setItem("societySubscriptionId", "");
  localStorage.setItem("societyId", "");
  localStorage.setItem("societyName", "");
  localStorage.setItem("firstSocietySubscriptionId","");
}

export const societiesService = {
  initialFieldValues,
  initialParameterFieldValues,
  getAll,
  post,
  put,
  remove,
  deleteQRImage,
  activateOrDeActivate,
  getById,
  getByUserId,
  getBySubscriberId,
  EditParametersDetails,
  clearSocietyAndSubscription,
  clearStorageForIndex
};
