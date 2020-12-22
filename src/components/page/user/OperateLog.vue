<template>
  <div>
    <div class="search-form">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input size="small" v-model="searchForm.userName" placeholder="操作人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="searchForm.ip" placeholder="IP"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.startTime" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsStart" placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.endTime" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsEnd" placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getTableData" icon="el-icon-search" :loading="loading">搜 索</el-button>
          <el-button size="small" @click="resetData">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-cont">
        <el-table ref="dataTable" :data="tableData" @selection-change="handleSelectionChange" border stripe> 
          <el-table-column prop="userName" label="操作人" min-width="20" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ip" label="IP地址"   min-width="30" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime"   min-width="30" label="操作时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="description"  label="操作描述" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="table-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchForm.pageNum"
            :page-sizes="[10, 15, 30, 50]"
            :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalData">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/common.api.js"
import moment from "moment";
export default {
  name: "OperateLog",
  data(){
    return {
      loading:false,
      totalData:0,
      tableData:[],
      searchForm:{
        userName:'', //操作人登录用户名
        ip:'', //操作人登录ip
        startTime:moment().format("YYYY-MM-DD") + " 00:00:00", //开始时间
        endTime:moment().format("YYYY-MM-DD HH:mm:ss"), //结束时间
        pageNum:1, //当前页
        pageSize:10 //每页大小
      },
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
    }
  },
  methods:{
    async getTableData(){ //操作日志管理-分页查询
      if(new Date(this.searchForm.endTime).getTime()>new Date().getTime()||new Date(this.searchForm.startTime).getTime()>new Date().getTime()){
        this.$message({
          type: "warning",
          message: "请不要选择未来时间!",
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
      let params =this.searchForm
      this.loading=true;
      api.user.searchOperateLog(params).then(res=>{
        this.loading=false;
        this.tableData = res.data.data;
        this.totalData = res.data.count
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val){
      this.searchForm.pageNum = val
      this.getTableData()
    },
    resetData(){
      this.searchForm = {
        userName:'', //操作人登录用户名
        ip:'', //操作人登录ip
        startTime:moment().format("YYYY-MM-DD") + " 00:00:00", //开始时间
        endTime:moment().format("YYYY-MM-DD HH:mm:ss"), //结束时间
        pageNum:1, //当前页
        pageSize:10 //每页大小
      }
      this.getTableData()
    },
    handleSelectionChange(val) { // 暂存选中数据
      this.tableData = val;
    },
  },
  created(){
    this.getTableData()
  }
};
</script>
