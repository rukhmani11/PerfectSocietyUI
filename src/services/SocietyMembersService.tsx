import {
  SocietyMemberTitleModel,
  SocietyMembersModel,
} from "../models/SocietyMembersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { Guid } from "guid-typescript";
import { config } from "../utility/Config";
const initialFieldValues: SocietyMembersModel = {
  SocietyMemberId: Guid.EMPTY,
  SocietyId: "",
  FolioNo: null,
  Member: "",
  MemberClassId: "",
  ContactPerson: "",
  Address: "",
  City: "",
  Pin: null,
  StateId: "",
  CountryCode: "",
  PhoneNo: "",
  HomePhoneNo: "",
  OfficePhoneNo: "",
  MobileNo: "",
  OccupationId: "",
  Occupation: "",
  LoanFrom: "",
  LoanClearedOn: null,
  FourWheelers: null,
  TwoWheelers: null,
  EmailId: "",
  GstNo: "",
  IsCommitteeMember: false,
};

const url = "/api/SocietyMembers";

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyMembersModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyMembersModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}
function getById(id: number) {
  return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}
function getBySocietyId(societyId: string) {
  return customAxios.get(
    `${url}/GetBySocietyId/${societyId}`,
    axiosRetryConfig
  );
}

function getSelectListBySocietyId(societyId: string) {
  return customAxios.get(
    `${url}/GetSelectListBySocietyId/${societyId}`,
    axiosRetryConfig
  );
}

function getSelectListBySocietyBuildingUnitID(societyBuildingUnitID: string) {
  return customAxios.get(
    `${url}/GetSelectListBySocietyBuildingUnitID/${societyBuildingUnitID}`,
    axiosRetryConfig
  );
}

function GetSocietyBuildingUnitIDForNoOpeningBalance(
  societyBuildingUnitId: string
) {
  return customAxios.get(
    `${url}/SocietyBuildingUnitIDForNoOpeningBalance/${societyBuildingUnitId}`,
    axiosRetryConfig
  );
}

function getBySocietyBuildingUnitId(societyBuildingUnitID: string) {
  return customAxios.get(
    `${url}/GetBySocietyBuildingUnitId/${societyBuildingUnitID}`,
    axiosRetryConfig
  );
}
function downloadTemplate() {
  return customAxios.get(`${url}/DownloadImportTemplate`, {
    responseType: "blob",
  });
}

function uploadExcel(files: File[], payload: any) {
  const formData = new FormData();
  if (files != null && files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  }

  formData.append("data", JSON.stringify(payload));
  return customAxios.post(
    `${url}/UploadExcel`,
    formData,
    config.formDataConfig
  );
}
function getPageTitle(payload: SocietyMemberTitleModel) {
  
  return customAxios.post(`${url}/GetPageTitle`, payload, axiosRetryConfig);
}
export const societyMembersService = {
  initialFieldValues,
  getAll,
  post,
  put,
  remove,
  getById,
  getBySocietyId,
  getSelectListBySocietyId,
  getSelectListBySocietyBuildingUnitID,
  GetSocietyBuildingUnitIDForNoOpeningBalance,
  getBySocietyBuildingUnitId,
  downloadTemplate,
  uploadExcel,
  getPageTitle,
};
