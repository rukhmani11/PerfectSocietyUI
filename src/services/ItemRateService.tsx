import { axiosRetryConfig, customAxios } from "./AxiosHttpCommon";
import { ItemRateSearchModel } from "../components/etc/ItemRateModel";

const initialSearchFieldValues: ItemRateSearchModel = {
  SearchText: "",
  SearchedItem: "",
};
const url = "/api/ItemRate";

function getItemRates(searchText: string, searchCriteria: string) {
  
  if (searchText) {
    return customAxios.get(
      `${url}/GetItemRates?searchText=${searchText}&searchCriteria=${searchCriteria}`,
      axiosRetryConfig
    );
  } else {
    return customAxios.get(
      `${url}/GetItemRates?searchCriteria=${searchCriteria}`,
      axiosRetryConfig
    );
  }
}

export const itemRateService = {
  initialSearchFieldValues,
  getItemRates,
};
