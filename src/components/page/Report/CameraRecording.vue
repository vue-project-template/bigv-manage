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
          <el-date-picker
            v-model="searchForm.time"
            size="small"
            type="date"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="getData"
            icon="el-icon-search"
            :loading="loading"
            >搜 索</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="exportReport"
            :loading="loading"
            >导出报表</el-button
          >
          <el-button size="small" @click="resetData">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="chars-box" ref="chart"></div>
      <div style="margin-left: 80px; color: #777; font-size: 14px">
        当前默认展示数据是前一天采集的数据报表展示
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
const echarts = require("echarts");
import DateUtils from "@/utils/dateUtils.js";
import { exportExcel } from "@/utils/ExcelUtils.js";

export default {
  name: "CameraRecording",
  data() {
    return {
      loading: false,
      searchForm: {
        areaId: "",
        time: DateUtils.format(
          new Date(new Date() - 1 * 24 * 3600 * 1000),
          "yyyy-MM-dd"
        ),
      },
      currentUser: "",
      areaCode: "",
      tableData: [],

      recordingData: [],
      areaData: [], // 区域数据
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.areaCode = userInfo.area_code;
    this.currentUser = userInfo.user_name;
    this.getAreaData();
    // this.getTableData()
  },
  mounted() {
    this.getData();
  },
  methods: {
    exportReport() {
      //导出报表
      let col = [
        {
          title: "区域",
          dataIndex: "areaName",
          key: "areaName",
        },
        { title: "录像数", dataIndex: "haveRecord", key: "haveRecord" },
        { title: "总数", dataIndex: "totalRecord", key: "totalRecord" },
        { title: "录像率(%)", dataIndex: "onlineRate", key: "onlineRate" },
      ];
      let data = this.recordingData.map(item => {
        return {
          areaName: item.areaName,
          haveRecord: item.haveRecord,
          totalRecord: item.totalRecord,
          onlineRate: (item.haveRecord/item.totalRecord*100).toFixed(3)/100*100 // 此处的*100 /100主要用于保持小数的精度以及去掉小数末位无效的0
        }
      })
      exportExcel(
        col,
        data,
        `摄像头录像率-${DateUtils.format(new Date(), "yyyy-MM-dd")}.xlsx`
      );
    },
    async getAreaData() {
      // 获取区域数据
      let params = {
        areaCode: this.areaCode,
        currentUser: this.currentUser,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        let that = this;
        that.areaData = res;
      });
    },
    async getData() {
      let time = DateUtils.format(new Date(this.searchForm.time), "yyyyMMdd");
      let resp = await api.reportForm.getCameraVideotatisticsl({
        time,
        areaId: this.searchForm.areaId,
      });
      this.recordingData = resp.sort((a, b) => {
        return Number(a.city_code) - Number(b.city_code);
      });
      this.initCharts();
    },

    initCharts() {
      let myChart = echarts.init(this.$refs.chart);
      myChart.setOption({
        tooltip: {
          //提示框组件
          transitionDuration: 0,
          trigger: "axis",
          formatter: (params) => {
            let datas = this.recordingData.filter((i) => {
              return i.areaName == params[0].axisValue;
            });
            let tipHtml = "";
            tipHtml =
              '<div style="font-size:14px">' +
              datas[0].areaName +
              '<div style="font-size:14px">摄像头总数' +
              ":" +
              datas[0].totalRecord +
              '<div style="font-size:14px">摄像头录像数' +
              ":" +
              datas[0].haveRecord +
              '<div style="font-size:14px">摄像头录像率' +
              ":" +
              params[0].data +
              "%" +
              "</div>";
            return tipHtml;
          },
          axisPointer: {
            type: "none",
          },
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontSize: 12,
          },
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: true, //坐标轴两边留白
            data: this.recordingData.map((item) => item.areaName),
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              textStyle: {
                color: "#333",
                fontSize: 10,
              },
              rotate: -40,
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false,
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %",
              textStyle: {
                color: "#333",
                fontSize: 10,
              },
            },
            min: 80,
            max: 100,
            splitLine: {
              show: false,
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false,
            },
          },
        ],
        series: [
          {
            name: "摄像头在线率",
            type: "bar",
            symbol: "circle",
            barMaxWidth: 15,
            itemStyle: {
              normal: {
                color: "#3876d6",
              },
            },
            data: this.recordingData.map((item) =>
              !(item.totalRecord || item.haveRecord)
                ? 0
                : item.haveRecord === item.totalRecord
                ? 100
                : ((item.haveRecord / item.totalRecord) * 100).toFixed(2)
            ),
          },
        ],
      });
    },

    resetData() {
      (this.searchForm = {
        areaId: "",
        time: "",
      }),
        this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.chars-box {
  width: 1000px;
  height: 550px;
}
</style>
