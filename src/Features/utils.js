import Axios from "axios";
import { GetNewToken } from "./zonefySlice";

export const baseURL = "http://64.23.156.172:5018/api/";

export const axios = Axios.create({ baseURL, withCredentials: false });

export const axiosAuth = (refreshToken) => {
  return Axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + refreshToken,
    },
  });
};

const axiosWithAuth = Axios.create();

export const setupAxiosInterceptors = (dispatch) => {
  axiosWithAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    config.baseURL = baseURL;
    config.timeout = 10000;
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  axiosWithAuth.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error?.response && error?.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        dispatch(GetNewToken({ token: refreshToken }));
        console.log("form utils: ", error);
        const newToken = localStorage.getItem("accessToken");
        const config = error.config;
        config.timeout = 10000;
        config.headers.Authorization = `Bearer ${newToken}`;
        // Dispatch action to get new token
        return Axios(config);
      }
      return Promise.reject(error);
    }
  );
};

export default axiosWithAuth;
