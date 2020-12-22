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
            v-model="searchNoSub.areaId"
            filterable
            @change="getSubareaData"
            placeholder="区域"
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
            v-model="searchNoSub.subareaId"
            filterable
            @change="getSiteData"
            placeholder="子区域"
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
            v-model="searchNoSub.siteId"
            filterable
            @change="getRoomData"
            placeholder="站点信息"
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
            class="is-required"
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
          <el-input
            size="small"
            v-model="searchForm.channelName"
            placeholder="摄像头名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            size="small"
            v-model="searchForm.status"
            filterable
            placeholder="状态"
          >
            <el-option
              v-for="item in statusOp"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.startTime"
            size="small"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsStart"
            placeholder="开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.endTime"
            size="small"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsEnd"
            placeholder="结束时间"
          >
          </el-date-picker>
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
            prop="area_name"
            label="区域信息"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="subarea_name"
            label="子区域信息"
            show-overflow-tooltip
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
            prop="channel_name"
            label="摄像头名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="event_time"
            label="状态变更时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            :formatter="formatterStatus"
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
import $lodash from "lodash";
import moment from "moment";
export default {
  name: "CameraStatus",
  data() {
    return {
      loading: false,
      searchForm: {
        roomId: "",
        channelName: "",
        status: "",
        startTime: moment().format("YYYY-MM-DD") + " 00:00:00",
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        pageNum: 1,
        pageSize: 15,
      },
      searchNoSub: {
        areaCode: "",
        currentUser: "",
        areaId: "",
        subareaId: "",
        siteId: "",
      },
      tableData: [],
      totalData: 0,
      areaData: [], // 区域数据
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      roomData: [], // 站点下机房信息数据
      frameData: [], // 机架信息数据
      statusOp: [
        {
          value: 0,
          label: "下线",
        },
        {
          value: 1,
          label: "上线",
        },
      ],
      pickerOptionsStart: {
        disabledDate: (currentTime) => {
          // 开始时间禁用时间段
          let endDateVal = this.searchForm.endTime;
          if (endDateVal) {
            // 如果已经选择了结束时间
            // 禁用结束日期的之后时间
            return (
              currentTime.getTime() > new Date(endDateVal).getTime() - 1000
            );
          }
          // 禁用当前时间的之后时间（加载组件就会开启禁用）
          // return currentTime.getTime() > new Date().getTime()
        },
      },
      pickerOptionsEnd: {
        disabledDate: (currentTime) => {
          // 结束时间禁用时间段
          let beginDateVal = this.searchForm.startTime;
          if (beginDateVal) {
            // 如果已经选择了开始时间
            // 禁用开始日期的之前时间  和 禁用今天之后的日期
            return (
              currentTime.getTime() <
              new Date(beginDateVal).getTime() - 86398000
            );
            //  || currentTime.getTime() > new Date().getTime()
          }
          // 禁用当前时间的之后时间（加载组件就会开启禁用）
          // return currentTime.getTime() > new Date().getTime()
        },
      },
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchNoSub.areaCode = userInfo.area_code;
    this.searchNoSub.currentUser = userInfo.user_name;
    this.getAreaData();
    this.getTableData();
    // this.getStartTime();
  },
  methods: {
    getStartTime() {
      let nowDate = new Date();
      this.searchForm.startTime = new Date(
        nowDate.getFullYear() +
          "-" +
          (nowDate.getMonth() + 1) +
          "-" +
          nowDate.getDate()
      );
    },
    async getTableData() {
        if(new Date(this.searchForm.endTime).getTime()>new Date().getTime()||new Date(this.searchForm.startTime).getTime()>new Date().getTime()){
            this.$message({
                type: "warning",
                message: "请选择不要选择未来时间!",
            });
            return;
        }
        if(new Date(this.searchForm.endTime).getTime()<new Date(this.searchForm.startTime).getTime()){
            this.$message({
                type: "warning",
                message: "结束时间应大于开始时间!",
            });
            return;
        }
      // 获取表格数据
      let params = this.searchForm;
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      params.groupId = userInfo.groupId;
      params.userName = userInfo.user_name;
      params.areaId = this.searchNoSub.areaId;
      params.subareaId = this.searchNoSub.subareaId;
      params.siteId = this.searchNoSub.siteId;
      this.loading = true;
      await api.alarm.getCameraState(params).then((res) => {
        this.loading = false;
        let that = this;
        that.totalData = res.cnt;
        that.tableData = res.list;
        // loading.close()
      });
    },
    formatterStatus(row, column) {
      return this.statusOp.find((i) => {
        return i.value === row.status;
      }).label;
    },

    async getAreaData() {
      // 获取区域数据
      let params = {
        areaCode: this.searchNoSub.areaCode,
        currentUser: this.searchNoSub.currentUser,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        this.areaData = res;
      });
    },
    async getSubareaData(val) {
      // 获取子区域数据
      this.searchNoSub.subareaId = "";
      this.searchNoSub.siteId = "";
      this.searchForm.roomId = "";
      let params = {
        areaCode: this.searchNoSub.areaCode,
        currentUser: this.searchNoSub.currentUser,
        areaId: val,
      };
      await api.resources.getSubareaInfo(params).then((res) => {
        this.subAreaData = res;
        this.siteData = this.roomData = [];
      });
    },
    async getSiteData(val) {
      // 获取站点信息数据
      this.searchNoSub.siteId = "";
      this.searchForm.roomId = "";
      let params = {
        areaCode: this.searchNoSub.areaCode,
        currentUser: this.searchNoSub.currentUser,
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
        areaCode: this.searchNoSub.areaCode,
        currentUser: this.searchNoSub.currentUser,
        siteId: val,
      };
      await api.resources.getRoomInfo(params).then((res) => {
        this.roomData = res;
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
      (this.searchNoSub.areaId = ""),
        (this.searchNoSub.subareaId = ""),
        (this.searchNoSub.siteId = ""),
        (this.searchForm = {
          // areaCode: this.searchNoSub.areaCode,
          // currentUser: this.searchNoSub.currentUser,
          // areaId: '',
          // subareaId: '',
          // siteId: '',
          roomId: "",
          channelName: "",
          status: "",
          startTime: moment().format("YYYY-MM-DD") + " 00:00:00",
          endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          pageNum: 1,
          pageSize: 15,
        }),
        this.getTableData();
    },
  },
};
</script>
