<template>
  <div>
    <div class="search-form">
      <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input size="small" v-model="searchForm.policyCode" placeholder="策略ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="searchForm.policyName" placeholder="策略名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="getTableData" icon="el-icon-search" :loading="loading">搜 索</el-button>
          <el-button size="small" @click="resetData">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-btns">
        <el-button type="success" size="mini" @click="openEdit">新 增</el-button>
        <el-button type="danger" size="mini" @click="deleteData">删 除</el-button>
      </div>
      <div class="table-cont">
        <el-table ref="dataTable" :data="tableData" @selection-change="handleSelectionChange" border stripe> 
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="policy_code" label="策略ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="policy_name" label="策略名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="policy_type" label="策略类型" :formatter="formatterType" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="room_name" label="是否告警" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="start_time" label="开始时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="end_time" label="结束时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cn_name" label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="openEdit(scope.row, 'readOnly')">查看</el-button>
              <el-button type="text" size="mini" @click="openEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="deleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
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
    <EditStrategy v-if="dialogs.editDlgShow" :alarmData="editAlarm" @close="closeDlg" @updateData="getTableData"></EditStrategy>
  </div>
</template>

<script>
import api from "@/api/common.api.js"
import EditStrategy from './EditStrategy'
export default {
  name: "Cabinet",
  components: {
    EditStrategy
  },
  data() {
    return {
      loading:false,
      searchForm: {
        deviceName: '',
        deviceCode: '',
        pageNum: 1,
        pageSize: 15
      },
      tableData: [],
      totalData: 0,
      selectDatas: [], // 选中的数据

      policyTypeOp: [ // 策略类型下拉数据 
        {
          value: '0',
          label: '不告警策略'
        },
        {
          value: '1',
          label: '长时间未处理告警'
        }
      ], 

      dialogs: {
        editDlgShow: false
      },
      editAlarm: {}
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() { // 获取表格数据
      let params = this.searchForm;
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      params.groupId=userInfo.groupId;
      params.userName=userInfo.user_name;
      this.loading=true;
      await api.alarm.getAlarmPolicyPagingInfo(params).then(res => {
        this.loading=false;
        let that = this;
        that.totalData = res.cnt
        that.tableData = res.list
      })
    },
    formatterType(row, column) {
      return this.policyTypeOp.find(i => {
        return i.value === row.policy_type
      }).label
    },

    handleSelectionChange(val) { // 暂存选中数据
      this.selectDatas = val;
    },

    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getTableData()
    },
    resetData() {
      this.searchForm = {
        deviceName: '',
        deviceCode: '',
        pageNum: 1,
        pageSize: 15
      },
      this.getTableData()
    },

    openEdit(data, type) { // 打开关联弹框
      if(data.id) {
        this.editAlarm = data
        this.editAlarm.readOnly = type || ''
      }else{
        this.editAlarm = {}
      }
      this.dialogs.editDlgShow = true
    },
    closeDlg(val) { // 关闭弹框方法
      this.dialogs[val] = false
    },

    deleteData(val) {
      if(this.selectDatas.length < 1 && !val.id){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      let tip = val.id ? '是否删除本条数据？' : '是否删除所选数据？'
      let policyCodes = val.id ? [val.policy_code] : this.selectDatas.map(i => {
        return i.policy_code
      })
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAlarmPolicies(policyCodes)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableData()
      })
    },
    async deleteAlarmPolicies(policyCodes) { // 删除策略信息
      await api.alarm.deleteAlarmPolicies({policyCodes})
    },
  },
};
</script>
