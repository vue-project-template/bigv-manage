<template>
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
                  v-model="parmas.community"
                  placeholder="小区"
                  clearable
                  filterable
                  style="width: 200px;"
                  :popper-append-to-body="false"
          >
              <el-option v-for="item in communitys" :key="item.id" :label="item.areaName" :value="item.areaCode"  />
          </el-select>
          <!--<el-select
                  v-model="parmas.channel"
                  placeholder="摄像头"
                  clearable
                  filterable
                  style="width: 200px;"
                  :popper-append-to-body="false"
          >
              <el-option v-for="item in channels" :key="item.id" :label="item.areaName" :value="item.areaCode"  />
          </el-select>-->
          <el-date-picker
                  v-model="parmas.startTime"
                  placeholder="开始时间"
                  type="datetime"
                  prefix-icon="el-icon-date"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsStart"
          >
          </el-date-picker>

          <el-date-picker
                  v-model="parmas.endTime"
                  placeholder="截止时间"
                  type="datetime"
                  prefix-icon="el-icon-date"
                  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsEnd"
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
        <el-table-column prop="province"  label="省"></el-table-column>
        <el-table-column prop="city" label="市"></el-table-column>
        <el-table-column prop="region" label="区"></el-table-column>
        <el-table-column prop="community" label="小区"></el-table-column>
        <!--<el-table-column prop="channel" label="摄像头"></el-table-column>-->
        <el-table-column  show-overflow-tooltip label="图片url" >
            <template slot-scope="scope">
                <el-popover placement="right" title="" trigger="hover">
                    <img :src="scope.row.imageUrl" style="height: 500px;width: 500px">
                    <img slot="reference" :src="scope.row.imageUrl" alt="" style="max-height: 40px;max-width: 40px">
                </el-popover>
            </template>

        </el-table-column>
        <el-table-column prop="imageCreatTime"   :formatter="dateForma" label="图片创建时间" sortable></el-table-column>
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
</template>


<script>

  import api from '../../../api/faceImage.api'
export default {
  name: "engineRoom-router",
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "odd-row";
      } else {
        return "even-row";
      }
    },
      getFormatDate(date) {
          let month = date.getMonth() + 1;
          let strDate = date.getDate();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          let hours=date.getHours()<10?"0"+date.getHours():date.getHours();
          let minute = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
          let second = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
          var currentDate = date.getFullYear()+'-'+ month +'-'+ strDate
              +' '+hours+':'+minute+':'+second;
          return currentDate;
      },
      dateForma:function(row,column){
          let date = row[column.property];
          if(!date){return ''};
          return this.getFormatDate(new Date(date))

      },
    //查询
    search(){
      if(this.parmas.startTime)this.parmas.imageCreatTimeForm=new Date(this.parmas.startTime).getTime();
      if(this.parmas.endTime)this.parmas.imageCreatTimeTo=new Date(this.parmas.endTime).getTime();
      this.parmas.pageNumber=(this.pageNumber-1)?1:(this.pageNumber-1);
      this.parmas.pageSize=this.pageSize;
      api.getFaceRecoed(this.parmas).then(res => {
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
    /*getChannels(parentCode){
        api.getAreaTree({parentCode:parentCode}).then(res => {
            this.channels=res;
        });
    },*/
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
      //摄像头
      channels:[],
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
  },
  created() {
    api.getAreaTree({parentCode:'100000'}).then(res => {
      this.provinces=res;
    });
  }
};

</script>
<style lang="less">

</style>
