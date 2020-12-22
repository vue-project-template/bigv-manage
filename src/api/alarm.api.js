import http from "../http";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res.data;
  },
  // 分页获取策略信息接口
  async getAlarmPolicyPagingInfo(params) {
    return await this.request("/alarm/getAlarmPolicyPagingInfo", params);
  },
  // 新增告警策略接口
  async addAlarmPolicy(params) {
    return await this.request("/alarm/addAlarmPolicy", params, "put");
  },
  // 编辑告警策略接口
  async editAlarmPolicy(params) {
    return await this.request("/alarm/editAlarmPolicy", params, "put");
  },
  // 告警策略删除接口
  async deleteAlarmPolicies(params) {
    return await this.request("/alarm/deleteAlarmPolicies", params, "del");
  },
  // 根据id查询告警策略接口
  async getAlarmPolicyById(params) {
    return await this.request("/alarm/getAlarmPolicyById", params);
  },
  // 获取告警类型接口
  async getAlarmPolicyType(params) {
    return await this.request("/alarm/getAlarmPolicyType", params);
  },

  // 分页获取摄像头状态接口
  async getCameraState(params) {
    return await this.request("/camera/getCameraState", params);
  },
};

export default api;
