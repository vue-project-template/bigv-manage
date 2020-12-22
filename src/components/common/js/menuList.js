const menuList = [ // 菜单配置文件
  {
    icon: "el-icon-user",
    index: "1",
    title: "用户管理",
    code: 'userManager',
    subs: [
      {
        index: "user",
        title: "用户管理",
        code: 'user',
        pCode: "userManager"
      },
      {
        index: "role",
        title: "角色管理",
        code: 'role',
        pCode: "userManager"
      },
      {
        index: "group",
        title: "组管理",
        code: 'group',
        pCode: "userManager"
      },
      // {
      //   index: "changePassword",
      //   title: "修改密码",
      //   code: 'changePassword',
      //   pCode: "userManager"
      // },
    ],
  },
  {
    icon: "el-icon-s-order",
    index: "2",
    title: "资源管理",
    code: 'resourceManager',
    subs: [
      {
        index: "siteInfo",
        title: "站点信息",
        code: 'siteInfo',
        pCode: "resourceManager"
      },
      {
        index: "roomInfo",
        title: "机房管理",
        code: 'roomInfo',
        pCode: "resourceManager"
      },{
        index: "frameManager",
        title: "机架管理",
        code: 'frameManager',
        pCode: "resourceManager"
      },{
        index: "equipment",
        title: "设备管理",
        code: 'equipment',
        pCode: "resourceManager"
      },{
        index: "camera",
        title: "摄像头管理",
        code: 'camera',
        pCode: "resourceManager"
      },{
        index: "collectTree",
        title: "目录树管理",
        code: 'collectTree',
        pCode: "resourceManager"
      },
    ],
  },
  {
    icon: "el-icon-bell",
    index: "3",
    title: "告警管理",
    code: 'alarmManager',
    subs: [
      {
        index: "alarmStrategy",
        title: "告警策略",
        code: 'alarmStrategy',
        pCode: "alarmManager"
      },{
        index: "cameraStatus",
        title: "摄像头状态",
        code: 'cameraStatus',
        pCode: "alarmManager"
      },
    ],
  },
  {
    icon: "el-icon-s-data",
    index: "4",
    title: "报表管理",
    code: 'reportManager',
    subs: [
      {
        index: "cameraOnlineRate",
        title: "摄像头在线率报表",
        code: 'cameraOnlineRate',
        pCode: "reportManager"
      },{
        index: "cameraRecording",
        title: "摄像头录像率报表",
        code: 'cameraRecording',
        pCode: "reportManager"
      },
    ],
  },
  // {
  //   icon: "el-icon-office-building",
  //   index: "5",
  //   title: "山东管理",
  //   code: 'shandongManager',
  //   subs: [
  //     {
  //       index: "faceImage",
  //       title: "图片管理",
  //       code: 'faceImage',
  //       pCode: "shandongManager"
  //     },{
  //       index: "shandongReport",
  //       title: "报表管理",
  //       code: 'shandongReport',
  //       pCode: "shandongManager"
  //     },
  //   ],
  // }
]
export default menuList