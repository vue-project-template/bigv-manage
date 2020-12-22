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
            v-model="searchForm.siteType"
            filterable
            placeholder="站点类型"
          >
            <el-option
              v-for="item in siteTypeData"
              :key="item.index"
              :label="item.site_type"
              :value="item.site_type"
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
          <el-table-column prop="area_name" label="区域信息"></el-table-column>
          <el-table-column
            prop="subarea_name"
            label="子区域信息"
          ></el-table-column>
          <el-table-column
            prop="site_name"
            label="站点名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="site_group_name"
            label="集团名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="site_type" label="站点类型"></el-table-column>
          <el-table-column
            prop="site_address"
            label="站点位置"
            show-overflow-tooltip
          ></el-table-column>
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
  name: "SiteInfo",
  data() {
    return {
      loading: false,
      searchForm: {
        groupId: "",
        userName: "",
        areaId: "",
        subareaId: "",
        siteId: "",
        siteType: "",
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [],
      totalData: 0,

      areaData: [], // 区域数据
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      siteTypeData: [], // 站点类型数据
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.groupId = userInfo.groupId;
    this.searchForm.userName = userInfo.user_name;
    this.getAreaData();
    this.getSiteType();
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 获取表格数据
      let params = this.searchForm;
      this.loading = true;
      await api.resources.getSitePagingInfo(params).then((res) => {
        this.loading = false;
        this.totalData = res.cnt;
        this.tableData = res.list;
      });
    },
    async getAreaData() {
      // 获取区域数据
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        this.areaData = res;
      });
    },
    async getSubareaData(val) {
      // 获取子区域数据
      this.searchForm.subareaId = "";
      this.searchForm.siteId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        areaId: val,
      };
      await api.resources.getSubareaInfo(params).then((res) => {
        this.subAreaData = res;
        this.siteData = [];
      });
    },
    async getSiteData(val) {
      // 获取站点信息数据
      this.searchForm.siteId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        subareaId: val,
      };
      await api.resources.getSiteInfo(params).then((res) => {
        this.siteData = res;
      });
    },
    async getSiteType() {
      // 获取站点类型数据
      await api.resources.getSiteType().then((res) => {
        this.siteTypeData = res;
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
        userName: this.searchForm.userName,
        areaId: "",
        subareaId: "",
        siteId: "",
        siteType: "",
        pageNum: 1,
        pageSize: 15,
      }),
        this.getTableData();
    },
  },
};
</script>
