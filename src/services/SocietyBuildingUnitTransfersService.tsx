import { Guid } from "guid-typescript";
import { SocietyBuildingUnitTransfersModel } from "../models/SocietyBuildingUnitTransfersModel";
import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { config } from "../utility/Config";

const initialFieldValues: SocietyBuildingUnitTransfersModel = {
    SocietyBuildingUnitTransferId: Guid.EMPTY,
    SocietyBuildingUnitId: "",
    societySubscriptionId: "",
    SocietyMemberId: "",
    TransferDate: null,
    UEndDate: null,
    Remarks: "",
    TransferFee: 0,
    PaymentDetails: ""
};

const url = '/api/SocietyBuildingUnitTransfers';

function getAll() {
    return customAxios.get(`${url}/GetAll`, axiosRetryConfig);
}

function post(payload: SocietyBuildingUnitTransfersModel) {
    return customAxios.post(`${url}/Add`, payload, axiosRetryConfig);
}

function put(payload: SocietyBuildingUnitTransfersModel) {
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


export const SocietyBuildingUnitTransfersService = {
    initialFieldValues,
    getAll,
    post,
    put,
    remove,
    getById,
    getBySocietyBuildingUnitId,
    downloadTemplate,
    uploadExcel,
};