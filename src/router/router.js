import Vue from "vue";
import VueRouter from "vue-router";
import api from "@/api/common.api.js";

//import login  from '../views/login/Login';

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: process.env.NODE_ENV === "production" ? "history" : "hash",
  base: process.env.NODE_ENV === "production" ? "/manage/" : "/",
  routes: [
    {
      path: "/",
      redirect: "/user",
    },
    {
      path: "/",
      component: () => import("../components/common/Home.vue"),
      meta: { title: "自述文件" },
      children: [
        {
          path: "/user",
          component: () => import("../components/page/user/User.vue"),
          meta: { title: "用户管理" },
        },
        {
          path: "/role",
          component: () => import("../components/page/user/Role.vue"),
          meta: { title: "角色管理" },
        },
        {
          path: "/operateLog",
          component: () => import("../components/page/user/OperateLog.vue"),
          meta: { title: "操作日志管理" },
        },
        {
          path: "/group",
          component: () => import("../components/page/user/Group.vue"),
          meta: { title: "组管理" },
        },
        {
          path: "/changePassword",
          component: () => import("../components/page/user/ChangePassword.vue"),
          meta: { title: "修改密码" },
        },

        {
          path: "/siteInfo",
          component: () => import("../components/page/resources/SiteInfo.vue"),
          meta: { title: "站点管理" },
        },
        {
          path: "/roomInfo",
          component: () => import("../components/page/resources/Computer.vue"),
          meta: { title: "机房管理" },
        },
        ,
        {
          path: "/equipment",
          component: () => import("../components/page/resources/Equipment.vue"),
          meta: { title: "设备管理" },
        },
        {
          path: "/frameManager",
          component: () => import("../components/page/resources/Cabinet.vue"),
          meta: { title: "机架管理" },
        },
        {
          path: "/camera",
          component: () => import("../components/page/resources/Camera.vue"),
          meta: { title: "摄像头管理" },
        },
        {
          path: "/collectTree",
          component: () =>
            import("../components/page/resources/CollectTree.vue"),
          meta: { title: "目录树管理" },
        },
        {
          path: "/accessManager",
          component: () =>
            import("../components/page/resources/AccessManager.vue"),
          meta: { title: "门禁管理" },
        },

        {
          path: "/faceImage",
          component: () => import("../components/page/shandong/FaceImage"),
          meta: { title: "图片管理" },
        },
        {
          path: "/shandongReport",
          component: () => import("../components/page/shandong/Report"),
          meta: { title: "报表管理" },
        },

        {
          path: "/alarmStrategy",
          component: () => import("../components/page/alarm/AlarmStrategy"),
          meta: { title: "告警策略" },
        },
        {
          path: "/cameraStatus",
          component: () => import("../components/page/alarm/CameraStatus"),
          meta: { title: "摄像头状态" },
        },

        {
          path: "/cameraOnlineRate",
          component: () => import("../components/page/Report/CameraOnlineRate"),
          meta: { title: "摄像头在线率报表" },
        },
        {
          path: "/cameraRecording",
          component: () => import("../components/page/Report/CameraRecording"),
          meta: { title: "摄像头录像率报表" },
        },
      ],
    },
    {
      path: "/401",
      component: () => import("../views/errPage/401"),
      meta: { title: "401" },
    },
    {
      path: "/404",
      component: () => import("../views/errPage/404"),
      meta: { title: "404" },
    },
  ],
});

// const noLink = ['userManager', 'resourceManager', 'alarmManager', 'reportManager', 'shandongManager',
// 'videoMonitor', 'faceTracking', 'emap', 'warnPage', 'home']
const getAllMenuCode = function(item, arr) {
  // 递归获取所有有权限菜单code
  for (let i = 0; i < item.length; i++) {
    // if(item[i].icon==='icon')arr.push(item[i].url);
    if (item[i].children && item[i].children.length > 0) {
      getAllMenuCode(item[i].children, arr);
    } else {
      arr.push(item[i].url);
    }
  }
};
const getPrivilege = async function(params) {
  // 获取权限列表树结构
  return await api.user.getPrivilegeTree(params).then((res) => {
    let privilegeCodes = [];
    res && getAllMenuCode(res, privilegeCodes);
    router.app.$options.store.dispatch("setprivilegeCodes", res); // 权限code数组存入store
    return privilegeCodes;
  });
};

// 路由守卫
router.beforeEach((to, from, next) => {
  /*  if(to.matched.some(res=>res.meta.isLogin)){//判断是否需要登录*/
  // if(!router.app.$options.store.state.common.privilegeCodes) {
  // let isLogin = sessionStorage.getItem('userInfo')
  let isLogin = JSON.stringify({
    cn_name: "admin",
    id: 43,
    user_name: "admin",
    role_code: "0",
    groupId: "0", //所在区域code
    role_level: 0,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJzM1gyMnRBNnJuVT0iLCJpYXQiOjE2MDc5OTc1Nzd9.RSTfn3KjtSOWQBzxEOAjuL0dnb3v8x5P0BNDdL4qBtg",
    // cn_name: 'hui',
    // id: 89,
    // user_name: "hui",
    // role_code: "hui",
    // groupId: '123', //所在区域code
    // role_level: 0,
    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Imh1aSIsInBhc3N3b3JkIjoiN0l3dGJSUTBBUXRwOGloVWsyeVJwdz09IiwiaWF0IjoxNjA4MDg4MzA4fQ.DYNUdDSm7qmqGWdTO_Rje6gKzocuTXzXWaQVOk81JMY"
  });
  sessionStorage.setItem("userInfo", isLogin);
  let userInfo = JSON.parse(isLogin);
  isLogin && router.app.$options.store.dispatch("setUserInfo", userInfo); // 用户登陆信息存入store
  if (isLogin) {
    getPrivilege({ roleCode: userInfo.role_code }).then((res) => {
      if (to.path === "/401" || to.path === "/404") {
        next();
      }
      if (!res || (res && res.length === 0)) {
        next("/401");
      } else {
        if (to.path === "/user") {
          if (res[0] === "user") {
            next();
          } else {
            res[0] === "changePassword"
              ? res[1]
                ? next(`/${res[1]}`)
                : next("/401")
              : next(`/${res[0]}`);
          }
        } else {
          if (to.path.substring(1) === "changePassword") {
            next();
          } else if (res.indexOf(to.path.substring(1)) === -1) {
            next("/401");
          } else {
            next();
          }
        }
      }
    });
  } else {
    if (to.path === "/401" || to.path === "/404") {
      next();
    } else {
      next("/401");
    }
  }
});
export default router;
