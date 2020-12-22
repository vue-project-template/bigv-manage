<template>
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in crumbs" :key="item.index" :to="{ path: '/'+ item.index }">
        <i :class="item.icon"></i> {{item.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import menuList from '../common/js/menuList'
export default {
  data() {
    return {
      menus: [],
      crumbs: [],
      curRoute: this.$route.path
    }
  },
  watch: {
    $route(to,from){ // 监听路由变化
      this.initCrumb(to.path)
    }
  },
  created() {
    this.initCrumb(this.curRoute)
  },
  methods: {
    initCrumb(curR) {
      this.menus = []
      this.crumbs = []
      let curRoute = curR.substr(1, curR.length-1)
      this.getMenuArr(menuList)
      
      this.menus.forEach(item => { // 筛选出当前页面菜单
        if(item.index === curRoute) {
          this.crumbs.unshift(item)
          item.pIndex && this.getCrumbArr(item.pIndex)
        }
      })
    },
    getMenuArr(m) { // 递归处理所有菜单生成数组
      m.forEach(item => {
        this.menus.push(item)
        if(item.subs && item.subs.length > 0) {
          this.getMenuArr(item.subs)
        }
      })
    },
    getCrumbArr(i) { // 筛选当前页面父级菜单
      this.menus.forEach(n => {
        if(n.index === i) {
          this.crumbs.unshift(n)
          n.pIndex && this.getCrumbArr(n.pIndex)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .crumbs{
    padding: 0 10px;
    margin-top: 10px;
  }
</style>