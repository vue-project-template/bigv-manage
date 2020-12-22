<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input size="small" v-model="searchForm.name" placeholder="组名"></el-input>
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
          <el-table-column type="selection" :selectable="selectable"></el-table-column>
          <el-table-column prop="name" label="组名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="openEdit(scope.row)" >修改</el-button>
              <el-button type="text" size="mini" @click="deleteData(scope.row)" >删除</el-button>
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
    <EditGroup v-if="dialogs.editDlgShow" :groupData="editGroupData" @close="closeDlg" @updateData="getTableData"></EditGroup>
  </div>
</template>

<script>
import EditGroup from './EditGroup'
import api from "@/api/common.api.js"
export default {
  name: "Group",
  components: {
    EditGroup,
  },
  data() {
    return {
      loading:false,
      dialogs: {
        editDlgShow: false, // 编辑弹框显隐
      },
      searchForm: {
        name: '',
        pageNum: 1,
        pageSize: 15
      },
      editGroupData: {}, // 编辑时传入角色信息

      selectDatas: [], // 选中的数据
      tableData: [],
      totalData: 0
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() { // 获取表格数据
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      let params = this.searchForm;
      params.parentId = userInfo.groupId;
      params.userName = userInfo.user_name;
      this.loading=true;
      await api.user.searchGroup(params).then(res => {
        this.loading=false;
        let that = this;
        that.totalData = res.count;
        that.tableData = res.data
      })
    },
    selectable(row, index) {
      return row.role_code === '0' ? false : true
    },

    handleSelectionChange(val) { // 暂存选中数据
      this.selectDatas = val;
    },
    deleteData(val) {
      if(!val.id&&this.selectDatas.length < 1){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      let tip = val.id ? "是否删除本条数据？" : "是否删除所选数据？";
      let ids = val.id
        ? [val.id]
        : this.selectDatas.map((i) => {
            return i.id;
          });
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteGroup(ids);
      })
    },
    async deleteGroup(ids) { // 删除角色信息
      await api.user.deleteGroupByIds({ids:ids}).then(res=>{
        if(res.code !== 0){
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        } else {
          this.$message({
            type: 'success',
            message: res.message==='success'?'删除成功':res.message
          })
        }
        this.getTableData()
      })
    },

    async openEdit(data) { // 打开编辑/新增弹框

      await api.user.getGroup(data.id).then(res => {
        this.editGroupData={
          id:data.id,
          name:data.name,
          node:res,
        }
        this.dialogs.editDlgShow = true
      })
     /* if(data.id) {
        this.editRoleData = data
      } else {
        this.editRoleData = {}
      }*/

    },
    closeDlg(val) { // 关闭弹框方法
      this.dialogs[val] = false
    },

    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getTableData()
    },
    resetData() { // 重置
      this.searchForm = {
        roleCode: '',
        roleName: '',
        pageNum: 1,
        pageSize: 15
      }
      this.getTableData()
    }
  },
};
</script>
