import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { globalService } from "./GlobalService";

const customAxios: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
    //Don't pass token here. On Login its taking previous user token
    //Authorization: `Bearer  ${userService.useAuth().Token}`,
    //Authorization: `Bearer  ${localStorage.getItem("token")}`,
  },
});

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

const axiosRetryConfig: RetryConfig = {
  retry: 1,
  retryDelay: 1000,
};

// Add a request interceptor
// function cleanJSON(json : any) {
//
//   for (let key in json) {
//       if (json[key] === undefined || json[key] === "") {
//           json[key] = null;
//       } else if (typeof json[key] === 'object')
//           json[key] = cleanJSON(json[key]);
//   }
//   return json;
// }

customAxios.interceptors.request.use(
  function (config: any) {
    config.headers.Authorization = `Bearer  ${localStorage.getItem("token")}`;
    if (config.headers.getContentType() !== "multipart/form-data") {
      if (["post", "put", "patch"].includes(config.method)) {
        var replacer = function (key: any, value: any) {
          //|| value === 0
          return typeof value === "undefined" || value === "" ? null : value;
        };
        config.data = JSON.stringify(config.data, replacer);

        //config.data = cleanJSON(config.data);
      } else if (["get"].includes(config.method)) {
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  // response => {
  //
  //   var replacer = function (key: any, value: any) {
  //     return typeof value === null ? '' : value;
  //   }
  //   response.data = JSON.stringify( response.data, replacer);
  //   return response;
  // },
  (response) => response,
  (error) => {
    ///////////ERROR Handling and Display//////////
    let errMessage = "";

    console.log(error);
    ///////////////////////////////////////////
   
    /////////////////////////////////////
    if (error.response) {
      if (error.response?.data) {
        if (error.response.request?.responseType === "blob") {
          errMessage = "Could not create file. Error/No data found.";
        } else {
          errMessage = error.response.data.message;
        }
      }

      if (error.response?.status === 401) {
        errMessage = "401 - UnAuthorized.";
        localStorage.clear();
        window.location.href = "/login";
      } 
      else if (error.response?.status === 403) {
        errMessage = "403 - Forbidden. User is not permitted to access this method.";
      }
      else if (error.response?.status === 404) {
        errMessage = "API not found. Please check API path.";
      } else if (error.response?.status === 405) {
        errMessage =
          "405 - Method Not allowed. Please check API path/parameter.";
      } else if (error.response?.status === 0) {
        errMessage = "Connection Refused By Remote Server.";
        localStorage.clear();
        //window.location.href = '/login';
      } else if (error.response?.status === 400) {
        if (errMessage?.startsWith("Error converting value")) errMessage = "";
        else if (error.response?.data?.message) errMessage = error.response.data.message;
        else errMessage = errMessage ? errMessage : error.message;
      }
    } else {
      if (error.code === "ERR_NETWORK") {
        errMessage = "Connection Refused By Remote Server.";
        //localStorage.clear();
        //window.location.href = '/login'; //error log getting removed from console.
      } else errMessage = error.message;
    }
    //this is showing error converting value. Large popup with all posted data
    //globalService.error(errMessage ? errMessage : error.code + " : " + error.message);
    if (errMessage) globalService.error(errMessage);
    //////////////Ends Error handling and display//////////
    ///////////////////RETRY Requests//////////////////
    const { config } = error;

    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    config.retry -= 1;
    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("retry the request", config.url);
        resolve();
      }, config.retryDelay || 1000);
    });
    return delayRetryRequest.then(() => customAxios(config));
    ///////////////////ENDS RETRY Requests//////////////////
  }
);

export { customAxios, axiosRetryConfig };
