import http from "../http/index.js";
const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res.data;
  },

  //获取摄像头在线率
  async getCameraOnlineNumInfor(params) {
    return await this.request("/camera/getCameraOnlineNumInfor", params);
  },


  //获取摄像头录像率
  async getCameraVideotatisticsl(params) {
    return await this.request("/camera/getCameraVideotatisticsl", params);
  },
}

export default api;