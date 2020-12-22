<template>
  <div>
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
          <el-select
            size="small"
            v-model="searchForm.roomType"
            filterable
            placeholder="机房类型"
          >
            <el-option
              v-for="(item, index) in roomTypeData"
              :key="index"
              :label="item.room_type"
              :value="item.room_type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            size="small"
            v-model="searchForm.roomLevel"
            filterable
            placeholder="机房等级"
          >
            <el-option
              v-for="(item, index) in roomLevelData"
              :key="index"
              :label="item.room_level"
              :value="item.room_level"
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
          <el-table-column prop="area_name" label="区域名称"></el-table-column>
          <el-table-column
            prop="subarea_name"
            label="子区域名称"
          ></el-table-column>
          <el-table-column
            prop="site_name"
            label="站点名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="room_name"
            label="机房名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="room_group_name"
            label="集团名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="room_type" label="机房类型"></el-table-column>
          <el-table-column prop="room_level" label="机房等级"></el-table-column>
        </el-table>
        <div class="table-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchForm.pageNum"
            :page-sizes="[10, 15, 30, 50]"
            :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalData"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
export default {
  name: "Computer",
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
        roomType: "",
        roomLevel: "",
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [],
      totalData: 0,

      areaData: [], // 区域数据
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      roomData: [], // 站点下机房信息数据
      roomLevelData: [], // 机房等级数据
      roomTypeData: [], // 机房类型数据
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.groupId = userInfo.groupId;
    this.searchForm.currentUser = userInfo.user_name;
    this.getAreaData();
    this.getRoomType();
    this.getRoomLevel();
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 获取表格数据
      let params = this.searchForm;
      this.loading = true;
      await api.resources.getRoomPagingInfo(params).then((res) => {
        this.loading = false;
        this.totalData = res.cnt;
        this.tableData = res.list;
      });
    },
    async getAreaData() {
      // 获取区域数据
      let params = {
        //groupId: this.searchForm.groupId,
        currentUser: this.searchForm.currentUser,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        this.areaData = res;
      });
    },
    async getSubareaData(val) {
      // 获取子区域数据
      this.searchForm.subareaId = "";
      this.searchForm.siteId = "";
      this.searchForm.roomId = "";
      let params = {
        // groupId: this.searchForm.groupId,
        currentUser: this.searchForm.currentUser,
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
        currentUser: this.searchForm.currentUser,
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
        currentUser: this.searchForm.currentUser,
        siteId: val,
      };
      await api.resources.getRoomInfo(params).then((res) => {
        this.roomData = res;
      });
    },
    async getRoomType() {
      // 获取机房类型
      await api.resources.getRoomType().then((res) => {
        this.roomTypeData = res;
      });
    },
    async getRoomLevel() {
      // 获取机房等级
      await api.resources.getRoomLevel().then((res) => {
        this.roomLevelData = res;
      });
    },

    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.getTableData();
    },
    resetData() {
      (this.searchForm = {
        groupId: this.searchForm.groupId,
        currentUser: this.searchForm.userName,
        areaId: "",
        subareaId: "",
        siteId: "",
        roomId: "",
        roomType: "",
        roomLevel: "",
        pageNum: 1,
        pageSize: 15,
      }),
        this.getTableData();
    },
  },
};
</script>
