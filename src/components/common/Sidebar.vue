<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#000"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>

                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <el-menu-item v-else :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/js/bus";
import menuList from "../common/js/menuList";
import api from "@/api/common.api.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      collapse: false,
      items: [],
    };
  },
  computed: {
    ...mapState({
      privilegeCodes: (state) => state.common.privilegeCodes,
    }),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
    this.getMenu(this.privilegeCodes);
    // if(JSON.parse(sessionStorage.getItem('userInfo')).role_code === '0') {
    //   this.items = menuList
    // }else {
    //   this.getMenu().then(res => {
    //     this.items = res
    //   })
    // }
  },
  methods: {
    async getMenu(arr) {
      let newArr = [];
      arr.forEach((item) => {
        if (item.type === "1") {
          if (item.children) this.getMenu(item.children);
          item.code = item.privilege_code;
          item.index = item.url;
          item.pCode = item.parent_id;
          item.title = item.privilege_name;
          item.subs = item.children;
          newArr.push(item);
        }
      });
      this.items = newArr;
      //return this.filterTree(menuList, this.privilegeCodes)
    },

    filterTree(tree = [], map = [], arr = []) {
      if (!tree.length) return [];
      for (let item of tree) {
        if (!map.includes(item.code)) continue;
        let node = { ...item, subs: item.subs ? [] : null };
        arr.push(node);
        if (item.subs && item.subs.length)
          this.filterTree(item.subs, map, node.subs);
      }
      console.log(arr);
      return arr;
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
