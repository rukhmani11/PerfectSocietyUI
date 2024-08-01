import { Guid } from "guid-typescript";
import { SocietyBuildingUnitChargeHeadsModel } from "../models/SocietyBuildingUnitChargeHeadsModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { config } from "../utility/Config";

const initialFieldValues: SocietyBuildingUnitChargeHeadsModel = {
    SocietyBuildingUnitChargeHeadId: Guid.EMPTY,
    SocietyBuildingUnitId: "",
    ChargeHeadId: "",
    Rate: 0,
}

const url = '/api/SocietyBuildingUnitChargeHeads';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingUnitChargeHeadsModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitChargeHeadsModel) {
    return customAxios.put(`${url}/Edit`, payload, axiosRetryConfig);
}

function remove(id: number) {
    return customAxios.delete(`${url}/${id}`, axiosRetryConfig);
}

function getById(id: number) {
    return customAxios.get(`${url}/GetById/${id}`, axiosRetryConfig);
}

function getBySocietyBuildingUnitId(societyBuildingUnitId: string) {
    return customAxios.get(`${url}/GetBySocietyBuildingUnitId/${societyBuildingUnitId}`, axiosRetryConfig);
}
function getSocietyChargeHeadsBySocietyBuildingUnitId(societyId: string , societyBuildingUnitId: string) {
  return customAxios.get(`${url}/GetSocietyChargeHeadsBySocietyBuildingUnitId/${societyId}/${societyBuildingUnitId}`, axiosRetryConfig);
}

function downloadTemplate(societyId:string, societyBuildingId : string) {
    return customAxios.get(`${url}/DownloadImportTemplate/${societyId}/${societyBuildingId}`, {
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

export const societyBuildingUnitChargeHeadsService = {
    initialFieldValues,
    getById,
    getAll,
    post,
    put,
    remove,
    getBySocietyBuildingUnitId,
    downloadTemplate,
    uploadExcel,
    getSocietyChargeHeadsBySocietyBuildingUnitId,
};