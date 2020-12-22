import http from "../http/index.js";
import de from "element-ui/src/locale/lang/de";



const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res.data;
  },
  saveParams(params){
    if(params){
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      params.groupId=userInfo.groupId;
      params.userName=userInfo.user_name;
    }else {
      params={};
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      params.groupId=userInfo.groupId;
      params.userName=userInfo.user_name;
    }
    return params;
  },
  // 分页获取站点信息接口
  async getSitePagingInfo(params) {
    return await this.request("/resManager/getSitePagingInfo", params);
  },
  // 区域信息获取接口
  async getAreaInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getAreaInfo", params);
  },
  // 子区域信息获取接口
  async getSubareaInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getSubareaInfo", params);
  },
  // 站点信息获取接口
  async getSiteInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getSiteInfo", params);
  },
  // 站点类型获取接口
  async getSiteType(params) {
    return await this.request("/resManager/getSiteType", params);
  },
  // 站点下机房信息获取接口
  async getRoomInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getRoomInfo", params);
  },
  // 机房类型获取接口
  async getRoomType(params) {
    return await this.request("/resManager/getRoomType", params);
  },
  // 机房等级获取接口
  async getRoomLevel(params) {
    return await this.request("/resManager/getRoomLevel", params);
  },
  // 获取机架信息接口
  async getFrameInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getFrameInfo", params);
  },

  // 分页获取机房信息接口
  async getRoomPagingInfo(params) {
    this.saveParams(params);
    return await this.request("/resManager/getRoomPagingInfo", params);
  },
  // 分页获取机架信息接口
  async getFramePagingInfo(params) {
    return await this.request("/resManager/getFramePagingInfo", params);
  },

  // 设备信息获取接口
  // async getDeviceInfo(params) {
  //   return await this.request("/resManager/getDeviceInfo", params);
  // },
  // 分页获取设备信息接口
  async getDevicePagingInfo(params) {
    return await this.request("/resManager/getDevicePagingInfo", params);
  },
  // 新增设备接口
  async addDevice(params) {
    return await this.request("/resManager/addDevice", params, "put");
  },
  // 修改设备接口
  async editDevice(params) {
    return await this.request("/resManager/editDevice", params, "put");
  },
  // 删除设备接口
  async deleteDevice(params) {
    return await this.request("/resManager/deleteDevice", params, "del");
  },
  // 机架关联设备接口
  // async frameAssociationDevice(params) {
  //   return await this.request(
  //     "/resManager/frameAssociationDevice",
  //     params,
  //     "post"
  //   );
  // },

  // 分页获取通道信息接口
  async getChannelPagingInfo(params) {
    return await this.request("/resManager/getChannelPagingInfo", params);
  },
  // 摄像头关联机架接口
  async associationFrame(params) {
    return await this.request("/resManager/associationFrame", params, "post");
  },
  // 获取资源系统的机房目录树接口
  async getResTree(params) {
    params = this.saveParams(params);
    return await this.request("/map/getResTree", params);
  },
  // 根据channel_id获取机架信息接口
  async getFrameListByChannelId(params) {
    return await this.request("/resManager/getFrameListByChannelId", params);
  },
  // 根据channel_id获取未关联的机架信息接口
  async getUnbindFrameByChannelId(params) {
    return await this.request("/resManager/getUnbindFrameByChannelId", params);
  },

  // 资源系统的摄像头树结构接口
  async getResCameraTree(params) {
    params = this.saveParams(params);
    return await this.request("/camera/getResCameraTree", params);
  },
  // 获取未被资源系统绑定的摄像头目录树接口
  async getVpmCameraTree(params) {
    return await this.request("/camera/getVpmCameraTree", params);
  },
  // 取消关联机房接口
  // async unassociationRoom(params) {
  //   return await this.request("/resManager/unassociationRoom", params);
  // },
  // 关联机房接口
  async associationRoom(params) {
    return await this.request("/resManager/associationRoom", params, "post");
  },

  async getChannelInfo(params) {
    return await this.request("/resManager/getChannelInfo", params);
  },

  // 查询机房下未被关联的设备
  async getUnbindDeviceByRoomId(params) {
    return await this.request("/resManager/getUnbindDeviceByRoomId", params);
  },

  // 查询机架关联的设备
  async getBindDeviceByFrameId(params) {
    return await this.request("/resManager/getBindDeviceByFrameId", params);
  },
    //获取门禁机房树信息
  async getAccesscTree(params) {
    return await this.request("/accessc/getTree", params);},
  //获取门禁id
  async getAccessControl(params) {
    return await this.request("/accessc/getAccessControl", params);},
  //获取所有摄像头ByRoomId
  async getAllChannelIdByRoomId(params) {
    return await this.request("/map/getChannelInforBycproomCode", params);},
  //获取所有摄像头ByAccessId
  async getChannelIdByAccessId(params) {
    return await this.request("/accessc/getChannelIdByAccessId", params);},
  //新增门禁和摄像头关系
  async saveAccessChannelRel(params) {
    return await this.request("/accessc/saveAccessChannelRel", params,'post');},

  // 更新机架关联的设备
  async updateFrameBindDevices(params) {
    return await this.request(
      "/resManager/updateFrameBindDevices",
      params,
      "post"
    );
  },
};

export default api;
