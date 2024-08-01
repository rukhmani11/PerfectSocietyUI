import { Guid } from "guid-typescript";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { AppInfoModel, FlagsModel } from "../models/AppInfoModel";

const initialFieldValues: AppInfoModel = {
  Id: Guid.EMPTY,
  Abbreviation: "",
  Uomid: "",
  Currency: "",
  SubscriptionTaxId: "",
  SubscriptionInvoiceDueDays: 0,
  SubscriberTerms: "",
  Password: "",
  Flags: "",
  SmssocietyBillDltid: "",
  SmssocietyReceiptDltid: "",
  SmssocietyReceiptReversalDltid: "",
  EmailSocietyBillDltid: "",
  EmailSocietyReceiptDltid: "",
  EmailSocietyReceiptReversalDltid: "",
  SmsloginOtpdltid: "",
  Msg91AuthKey: "",
  Msg91EmailDomain: "",
  Msg91FromEmail: "",
  EaseBuzzKey: "",
  EaseBuzzSalt: "",
  EaseBuzzEnv: "",
  HomePageHtml: "",
  PrivacyPolicyHtml:"",
  TermsConditionsHtml:"",

  FlagInfo: {
    GstBill: false,
    MonthlyCharge: false,
    PreviousYear: false,
    MultiLingual: false,
    Dashboard: false,
    UPIPay: false,
    OtherReportExcel: false,
    SSDocsIntegration: false,
  },
  Mobile: "",
  Email: "",
};

// const initialFieldValuesForFlags: FlagsModel = {
//   GstBill: false,
//   PreviousYear: true,
//   MonthlyCharge: true,
//   MultiLingual: true,
//   Dashboard: true,
//   UPIPay:true,
//   OtherReportExcel:true
// };

const url = "/api/AppInfo";

function getAppInfo() {
  return customAxios.get(`${url}/GetAppInfo`, axiosRetryConfig);
}

function getAllHtml() {
  return customAxios.get(`${url}/GetAllHtml`, axiosRetryConfig);
}
// function post(payload : AppInfoModel) {
//     return customAxios.post(`${url}/Add`,payload, axiosRetryConfig);
// }

function put(payload: FlagsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}
export const appInfoService = {
  initialFieldValues,
  //initialFieldValuesForFlags,
  getAppInfo,
  getAllHtml,
  put,
};
