import { Guid } from "guid-typescript";
import { SocietyBuildingUnitsModel } from "../models/SocietyBuildingUnitsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import axios from "axios";
import { config } from "../utility/Config";
import { globalService } from "./GlobalService";

const initialFieldValues: SocietyBuildingUnitsModel = {
  SocietyBuildingUnitId: Guid.EMPTY,
  SocietyBuildingId: "",
  Unit: "",
  UnitTypeId: "",
  FloorNo: 0,
  Wing: "",
  CarpetArea: null,
  ChargeableArea: null,
  TerraceArea: null,
  StartDate: null,
  EndDate: null,
  CertificateNo: null,
  IssueDate: null,
  NoOfShares: null,
  DistinctiveFrom: null,
  DistinctiveTo: null,
  Value: null,
  PayDate: null,
  AmountAtAllotment: null,
};

const url = "/api/SocietyBuildingUnits";

function getById(id: number) {
  return customAxios.get(`${url}/GetByid/${id}`, axiosRetryConfig);
}

function getAll() {
  return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingUnitsModel) {
  return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitsModel) {
  return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
  return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getBySocietyBuildingId(societyBuildingId: string) {
  return customAxios.get(
    `${url}/GetBySocietyBuildingId/${societyBuildingId}`,
    axiosRetryConfig
  );
}

function getSelectListBySocietyBuildingId(societyBuildingId: string) {
  return customAxios.get(
    `${url}/GetSelectListBySocietyBuildingId/${societyBuildingId}`,
    axiosRetryConfig
  );
}

function getSelectListBySocietyId(societyId: string) {
  return customAxios.get(
    `${url}/GetSelectListBySocietyId/${societyId}`,
    axiosRetryConfig
  );
}

function getSocietyBuildingUnitNotInSocietySpecialBillsBySocietyId(societySpecialBillId:string, societyId: string) {
  return customAxios.get(
    `${url}/GetSocietyBuildingUnitNotInSocietySpecialBillsBySocietyId/${societySpecialBillId}/${societyId}`,
    axiosRetryConfig
  );
}

function getSocietyFlatPendingCount(societyId: string) {
  return customAxios.get(
    `${url}/GetSocietyFlatPendingCount/${societyId}`,
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

export const societyBuildingUnitsService = {
  initialFieldValues,
  getById,
  getAll,
  post,
  put,
  remove,
  getBySocietyBuildingId,
  getSelectListBySocietyBuildingId,
  getSelectListBySocietyId,
  downloadTemplate,
  uploadExcel,
  getSocietyFlatPendingCount,
  getSocietyBuildingUnitNotInSocietySpecialBillsBySocietyId
};
