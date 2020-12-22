import http from "../http/index.js";

const api = {
  async request(url, params, type = "get") {
    let res = await http.request(url, params, type);
    return res.data;
  },
  // 用户管理---分页查询用户信息
  async getUserList(params) {
    return await this.request("/users/getUserList", params);
  },
  // 用户管理---新增用户
  async addUser(params) {
    return await this.request("/users/addUser", params, 'put');
  },
  async addUserChannelRelate(params) {
    return await this.request("/users/addUserChannelRelate", params, 'post');
  },
  // 用户管理---修改用户信息
  async editUser(params) {
    return await this.request("/users/editUser", params, 'put');
  },
  // 用户管理---修改密码
  async changePwd(params) {
    return await this.request("/users/changePwd", params, 'post');
  },
  // 用户管理---删除用户信息
  async deleteUser(params) {
    return await this.request("/users/deleteUser", params, 'del');
  },
  // 用户管理---根据id查询用户接口
  async getUserById(params) {
    return await this.request("/users/getUserById", params);
  },
  
  //操作日志管理-分页查询
  async searchOperateLog(params) {
    return await http.get('/users/searchOperateLog',params);
  },
  // 角色管理---分页查询角色信息
  async getRoleList(params) {
    return await this.request("/role/getRoleList", params);
  },
  // 角色管理---新增角色
  async addRole(params) {
    return await this.request("/role/addRole", params, 'put');
  },
  // 角色管理---修改角色
  async editRole(params) {
    return await this.request("/role/editRole", params, 'put');
  },
  // 角色管理---删除角色
  async deleteRole(params) {
    return await this.request("/role/deleteRole", params, 'del');
  },
  // 角色管理---根据id查询角色接口
  async getRoleById(params) {
    return await this.request("/role/getRoleById", params);
  },
  // 角色管理---获取所有角色接口
  async getAllRoles(params) {
    return await this.request("/role/getAllRoles", params);
  },
  // 角色管理---查询角色,级别<=level
  async getRolesByLevel(params) {
    return await this.request("/role/getRolesByLevel", params);
  },
  // 根据角色code获取权限菜单
  async getPrivilegeByRoleCode(params) {
    return await this.request("/role/getPrivilegeByRoleCode", params);
  },

  // 权限管理---获取权限列表树结构接口
  async getPrivilegeTree(params) {
    return await this.request("/role/getPrivilegeTree", params);
  },

  // 组管理---增加组的接口
  async addGroup(params) {
    return await this.request("/group/addGroup", params, 'put');
  },
  // 组管理---更新组的接口
  async updateGroup(params) {
    return await this.request("/group/updateGroup", params, 'put');
  },

  // 组管理---查询所有组的接口
  async searchAllGroup(params) {
    return await this.request("/group/searchAll", params);
  },
  // 组管理---查询所有组的接口
  async searchGroup(params) {
    return await this.request("/group/pageBy", params);
  },
  // 组管理---查询所有组的接口
  async getGroup(id) {
    return await this.request('/group/searchGroupById/'+id);
  },
  // 组管理---查询所有组的接口
  async deleteGroupByIds(params) {
    return await http.delete('/group/removeGroupByIds',params);
  },

 
};

export default api;
