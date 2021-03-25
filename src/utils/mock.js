import axios from "axios";

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
    //拦截响应，做统一处理
    if(response.status === 401) {
      console.log('un')
    }
    return response;
  },
  //接口错误状态处理，也就是说无响应时的处理
  (error) => {
    return Promise.reject(error.response.status); // 返回接口返回的错误信息
  }
);

export { api };
