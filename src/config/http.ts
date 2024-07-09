import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import router from "@/router";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 200000,
});

// Request interceptor
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Here you can check or modify your request headers
    // config.headers['Authorization'] = Your token;
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token; // 若token存在，则附加在请求头上
    }
    return config;
  },
  (error) => {
    // Output log
    console.error("request:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // Here you can check and parse your responses
    // if (response.data.code === 1000) {
    //   return Promise.resolve(response.data);
    // } else {
    //   return Promise.reject(response);
    // }
    return Promise.resolve(response);
  },
  (error) => {
    // Output log
    console.log(error.response.status);
    switch (error.response.status) {
      // token失效，清除进程和localStorage中的token，并跳转到登录页面
      case 401:
        router.push("/login");
        break;
    }
    return Promise.reject(error);
  }
);

export default service;
