<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">安徽电信机房监控管理平台</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 返回视频监控 -->
        <div class="btn-home" @click="toHome">
          <el-tooltip effect="dark" content="返回视频监控" placement="bottom">
            <i class="el-icon-s-home"></i>
          </el-tooltip>
        </div>
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div> -->
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div> -->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="hover" @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.cn_name}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../common/js/bus";
import api from "@/api/common.api.js"
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      userInfo: {
        cn_name: '',
        id: '',
        user_name: "",
        role_code: "",
        area_code: '', //所在区域code 
      },
      message: 2,
    };
  },

  methods: {
    ...mapActions(['setUserInfo']),
    
    // async getUserInfoById(params) { // 根据id查询用户
    //   await api.user.getUserById(params).then(res => {
    //     let that = this
    //     that.userInfo.area_code = res.area_code
    //     sessionStorage.setItem('userInfo', JSON.stringify(that.userInfo))
    //   })
    // },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        sessionStorage.removeItem("userInfo");
        this.setUserInfo(null)
        location.href = "/"
      } else if (command == 'changePassword') {
        this.$router.push("/changePassword");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    toHome() {
      location.href = "/"
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || this.userInfo
    // this.getUserInfoById({id: this.userInfo.id})
  },
  mounted() {
    // if (document.body.clientWidth < 1500) {
    //   this.collapseChage()
    // }
  },
}
</script>

<style lang="less" scoped>
.btn-home{
  margin-right: 20px;
}
</style>