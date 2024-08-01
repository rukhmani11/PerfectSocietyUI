import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";

const url = '/api/Dashboard';

function getForDashboardPartA(SocietyId: string) {
    return customAxios.get(`${url}/GetForDashboardPartA/${SocietyId}`, axiosRetryConfig);
}

function getForDashboardPartB(SocietyId: string) {
    return customAxios.get(`${url}/GetForDashboardPartB/${SocietyId}`, axiosRetryConfig);
}

function getAcBalancesForSociety(SocietyId: string) {
    return customAxios.get(`${url}/GetAcBalancesForSociety/${SocietyId}`, axiosRetryConfig);
}

export const dashboardService = {
    getForDashboardPartA,
    getForDashboardPartB,
    getAcBalancesForSociety
};