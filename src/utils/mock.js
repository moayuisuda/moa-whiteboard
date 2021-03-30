import axios from "axios";
import { eventBus } from '@/state'

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("TOKEN");
    if (token) {
      //这里面获取的请求头的键(tokenHeader)根据每个后端的习惯封装的名称各不相同
      config.headers.common["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    if(error.response.status === 401) {
      eventBus.$emit('unauthorized')
      console.log('unauthorized!')
    }
    console.log({error})
    return Promise.reject(error.response.status); // 返回接口返回的错误信息
  }
);

export { api };
