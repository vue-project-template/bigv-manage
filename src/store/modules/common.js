const state = {
  privilegeCodes: null, // 菜单权限
  userInfo: null // 用户信息
}

const getters = {
  
}

const mutations = {
  SET_PRIVILEGE_CODES(state, data) { // 设置菜单权限
    state.privilegeCodes = data
  },
  SET_USER_INFO(state, data) { // 设置用户信息
    state.userInfo = data
  },
}

const actions = {
  setprivilegeCodes({ commit }, data){
    commit('SET_PRIVILEGE_CODES', data)
  },
  setUserInfo({ commit }, data){
    commit('SET_USER_INFO', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}