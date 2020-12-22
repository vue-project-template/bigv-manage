<template>
  <div style="display:flex;justify-content: space-between;">
    <div class="content-left">
      <el-input
        placeholder="搜索"
        size="mini"
        v-model="filterTreeText"
        @keyup.enter.native="filterTree"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="filterTree"
        ></el-button>
      </el-input>
      <el-tree
        class="filter-tree"
        :data="roomTreeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="roomTree"
        v-loading="loadingTree"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        :emptyText="emptyText"
      >
      </el-tree>
    </div>
    <div class="content-right">
      <div class="search-form">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="searchForm"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-select
              size="small"
              v-model="searchForm.areaId"
              filterable
              @change="getSubareaData"
              placeholder="区域名称"
            >
              <el-option
                v-for="item in areaData"
                :key="item.area_id"
                :label="item.area_name"
                :value="item.area_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              size="small"
              v-model="searchForm.subareaId"
              filterable
              @change="getSiteData"
              placeholder="子区域名称"
            >
              <el-option
                v-for="item in subAreaData"
                :key="item.subarea_id"
                :label="item.subarea_name"
                :value="item.subarea_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              size="small"
              v-model="searchForm.siteId"
              filterable
              @change="getRoomData"
              placeholder="站点名称"
            >
              <el-option
                v-for="item in siteData"
                :key="item.site_id"
                :label="item.site_name"
                :value="item.site_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              size="small"
              v-model="searchForm.roomId"
              filterable
              placeholder="机房名称"
            >
              <el-option
                v-for="item in roomData"
                :key="item.room_id"
                :label="item.room_name"
                :value="item.room_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="getTableData"
              icon="el-icon-search"
              :loading="loading"
              >搜 索</el-button
            >
            <el-button size="small" @click="resetData">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-container">
        <div class="table-cont">
          <el-table ref="dataTable" :data="tableData" border stripe>
            <el-table-column
              prop="name"
              label="门禁名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="id"
              label="门禁ID"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="关联">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="openLink(scope.row)"
                  >关联摄像头</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <RelationAccess
      v-if="dialogs.relationChannel"
      :roomId="roomId"
      :accessId="accessId"
      @close="closeDlg"
      @updateData="getTableData"
    ></RelationAccess>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
import $lodash from "lodash";
import RelationAccess from "./RelationAccess";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
  name: "Camera",
  components: {
    RelationAccess,
  },
  watch: {},
  data() {
    return {
      loading: false,
      searchForm: {
        groupId: "",
        userName: "",
        areaId: "",
        subareaId: "",
        siteId: "",
        roomId: "",
        roomCode: "",
      },
      roomId: "",
      tableData: [],

      filterTreeText: "", // 机房树筛选框文本
      roomTreeData: [], // 机房树数据
      defaultProps: {
        children: "children",
        label: "name",
      },
      areaData: [], // 区域数据
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      roomData: [], // 站点下机房信息数据
      frameData: [], // 机架信息数据

      dialogs: {
        relationChannel: false,
      },
      accessId: "",
      loadingTree: false,
      emptyText: "",
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.groupId = userInfo.groupId;
    this.searchForm.userName = userInfo.user_name;
    this.getAreaData();
    //this.getTableData()
    this.getResTree();
  },
  methods: {
    filterTree() {
      if (this.filterTreeText) this.$refs.roomTree.filter(this.filterTreeText);
      else this.roomTreeData = JSON.parse(JSON.stringify(this.roomTreeData));
    },
    async getTableData(paramsData) {
      // 获取表格数据
      let params =
        paramsData && paramsData.userName ? paramsData : this.searchForm;
      let param = $lodash.cloneDeep(params);
      if (params.roomCode) {
        param.roomId = params.roomCode;
        this.roomId = params.roomCode;
      } else {
        this.roomId = params.roomId;
      }
      if (!param.roomId) {
        this.$message({
          type: "warning",
          message: "请选择一个机房!",
        });
      }
      this.loading = true;
      await api.resources.getAccessControl(param).then((res) => {
        this.loading = false;
        this.tableData = res;
      });
    },
    async getResTree() {
      // 获取机房列表树结构
      this.loadingTree = true;
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      api.resources
        .getAccesscTree({
          userId: userInfo.id,
          userName: userInfo.user_name,
          groupId: userInfo.groupId,
        })
        .then((res) => {
          this.roomTreeData = res;
          this.loadingTree = false;
          if (ArrayUtils.isEmpty(this.roomTreeData)) {
            this.emptyText = "暂无数据";
          }
        });
    },
    //模糊搜索的过滤
    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (
        data.name.indexOf(value) !== -1 ||
        (data.channel_ip && data.channel_ip.indexOf(value) !== -1)
      ) {
        return true;
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.name.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },
    handleNodeClick(data) {
      // 点击树节点查询摄像头
      if (data.level === 4) {
        let param = {
          groupId: this.searchForm.groupId,
          userName: this.searchForm.userName,
          areaId: "",
          subareaId: "",
          siteId: "",
          roomId: data.code,
        };
        // if(data.level === 1){
        //   params.areaId = data.code
        // } else if (data.level === 2) {
        //   params.subareaId = data.code
        // } else if (data.level === 3) {
        //   params.siteId = data.code
        // } else if (data.level === 4) {
        //   params.roomId = data.code
        // }
        this.getTableData(param);
      }
    },
    async getAreaData() {
      // 获取区域数据
      let params = {
        //groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        this.areaData = res;
        this.subAreaData = this.siteData = this.roomData = [];
      });
    },
    async getSubareaData(val) {
      // 获取子区域数据
      this.searchForm.subareaId = "";
      this.searchForm.siteId = "";
      this.searchForm.roomId = "";
      let params = {
        //groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        areaId: val,
      };
      await api.resources.getSubareaInfo(params).then((res) => {
        this.subAreaData = res;
        this.siteData = this.roomData = [];
      });
    },
    async getSiteData(val) {
      // 获取站点信息数据
      this.searchForm.siteId = "";
      this.searchForm.roomId = "";
      let params = {
        //groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        subareaId: val,
      };
      await api.resources.getSiteInfo(params).then((res) => {
        this.siteData = res;
        this.roomData = [];
      });
    },
    async getRoomData(val) {
      // 获取站点下机房信息数据
      this.searchForm.roomId = "";
      let params = {
        //groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        siteId: val,
      };
      await api.resources.getRoomInfo(params).then((res) => {
        this.roomData = res;
      });
    },
    resetData() {
      (this.searchForm = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        areaId: "",
        subareaId: "",
        siteId: "",
        roomId: "",
      }),
        this.getTableData();
    },
    openLink(data) {
      // 打开关联弹框
      if (data.id) {
        this.accessId = data.id;
      }
      this.dialogs.relationChannel = true;
    },
    closeDlg(val) {
      // 关闭弹框方法
      this.dialogs[val] = false;
    },
  },
};
</script>

<style lang="less" scoped>
.content-left {
  width: 280px;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
  &::-webkit-scrollbar-track {
    background-color: #fff;
  }
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #a9a9a9;
    border-radius: 3px;
  }
}
.content-right {
  width: calc(100% - 300px);
}
</style>
