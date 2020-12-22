<template>
  <div>
    <div>
      <div class="search-form" style="height: 50px">
        <el-form :inline="true" :model="parmas">
          <el-select
                  v-model="parmas.province"
                  placeholder="省"
                  clearable
                  filterable
                  @change="getCitys"
                  :popper-append-to-body="false"
          >
            <el-option v-for="item in provinces" :key="item.id" :label="item.areaName" :value="item.areaCode" />
          </el-select>
          <el-select
                  v-model="parmas.city"
                  placeholder="市"
                  clearable
                  filterable
                  @change="getRegions"
                  :popper-append-to-body="false"
          >
            <el-option v-for="item in citys"  :key="item.id" :label="item.areaName" :value="item.areaCode" />
          </el-select>
          <el-select
                  v-model="parmas.region"
                  placeholder="区"
                  clearable
                  filterable
                  @change="getCommunitys"
                  :popper-append-to-body="false"
          >
            <el-option v-for="item in regions" :key="item.id" :label="item.areaName" :value="item.areaCode"  />
          </el-select>
          <el-select
                  v-model="parmas.communityCode"
                  placeholder="小区"
                  clearable
                  filterable
                  style="width: 200px;"
                  :popper-append-to-body="false"
          >
            <el-option v-for="item in communitys" :key="item.id" :label="item.areaName" :value="item.areaCode"  />
          </el-select>
          <el-date-picker
                  v-model="parmas.dailty"
                  placeholder="统计时间"
                  type="date"
                  prefix-icon="el-icon-date"
                  value-format="yyyyMMdd" format="yyyy-MM-dd"
                  :picker-options="pickerOptionsStart"
          >
          </el-date-picker>

          <el-button class="filter-item" @click="search" type="primary" icon="el-icon-search">Search</el-button>
        </el-form>
      </div>
      <div class="table-container">
        <div class="table-cont"  style="padding-top: 10px">
          <el-table
                  :data="tableData"
                  :row-class-name="tableRowClassName"
                  border
          >
            <el-table-column prop="communityCode"  label="小区"></el-table-column>
            <!--<el-table-column prop="channelCode" label="摄像头"></el-table-column>-->
            <el-table-column prop="dailty"   :formatter="dateForma" label="统计当天" ></el-table-column>
            <el-table-column prop="time" :formatter="timeForma" label="时间段"></el-table-column>
            <el-table-column prop="sum" label="总数"></el-table-column>

          </el-table>
          <div class="table-pagination">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNumber"
                    :page-sizes="[10, 15, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import api from "../../../api/faceImage.api";

export default {
  name: "engineRoom-router",
  methods:{
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "odd-row";
      } else {
        return "even-row";
      }
    },
    timeForma(row,column){
      let date = row[column.property];
      let times =date.split(',');
      return times[0]+':00-'
              +times[1]+':00';
    },
    dateForma:function(row,column){
      let date = row[column.property];
      return  date.substring(0,4)+'-'
              +date.substring(4,6)+'-'
              +date.substring(6,8)
    },
    //查询
    search(){
      this.parmas.pageNumber=(this.pageNumber-1)?1:(this.pageNumber-1);
      this.parmas.pageSize=this.pageSize;
      api.getReportStatistic(this.parmas).then(res => {
        if(res){
          this.tableData=res.content;
          this.totalElements=res.totalElements;
        }
      });
    },
    paginationChange(){
      if(this.tableData.length) this.search();
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.paginationChange();
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.paginationChange();
    },
    getCitys(parentCode){
      api.getAreaTree({parentCode:parentCode}).then(res => {
        this.citys=res;
      });
    },
    getRegions(parentCode){
      api.getAreaTree({parentCode:parentCode}).then(res => {
        this.regions=res;
      });
    },
    getCommunitys(parentCode){
      api.getAreaTree({parentCode:parentCode}).then(res => {
        this.communitys=res;
      });
    },
  },
  data() {
    return {
      pageNumber: 1,
      totalElements:0,
      pageSize: 15,
      tableData: [],
      parmas: {},
      //省
      provinces: [],
      //市
      citys: [],
      //区
      regions: [],
      //小区
      communitys:[],
      /* 控制前面时间选择器日期小于后者*/
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.parmas.endTime) {
            return time.getTime() > new Date(this.parmas.endTime).getTime()-1000;
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.parmas.startTime) {
            return time.getTime() < new Date(this.parmas.startTime).getTime()-86398000;
          }
        },
      },

    };
  },created() {
    api.getAreaTree({parentCode:'100000'}).then(res => {
      this.provinces=res;
    });
  }

};
</script>
<style lang="less">

</style>
