import axios from "axios";
import router from "../router/router";

let PREFIX = "/api",
  IP = "";
if (process.env.NODE_ENV === "development") {
  PREFIX = "/api";
  IP = "http://localhost:8080";
}

// 创建axios实例
var instance = axios.create({
  timeout: 50000,
});

// request拦截器
instance.interceptors.request.use(
  (config) => {
    config.url = PREFIX + config.url;
    if (config.url.endsWith("json")) {
      config.url = IP + config.url.replace("/api", "");
    } else if (config.url.endsWith("picture/upload")) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    let user = JSON.parse(sessionStorage.getItem("userInfo"));
    config.headers['Authorization'] = user ? `Bearer ${user.token}` : '';
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error);
    Promise.reject(error);
  }
);

// respone拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // 此处判断登录是否过期
      if (response.data.code === 401) {
        return router.replace('/login');
      }
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      return data;
    } else {
      return Promise.reject("error:" + response.status);
    }
  },
  (error) => {
    console.log("err" + error);
    return Promise.reject(error);
  }
);

export default instance;
