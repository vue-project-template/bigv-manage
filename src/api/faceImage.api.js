import http from "../http/index";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res.data;
  },
  async getAreaTree(params) {
    return await this.request("/shandong/areaTree/parentCode", params);
  },

  async getFaceRecoed(params) {
    return await this.request("/shandong/faceRecoed/query", params);
  },

  async getReportStatistic(params) {
    return await this.request("/shandong/reportStatistic/query", params);
  },
};

export default api;
