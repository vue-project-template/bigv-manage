<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.loginName"
            placeholder="登录名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.userName"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="searchForm.isAllGroup"
            >显示所有子组用户</el-checkbox
          >
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
      <div class="table-btns">
        <el-button type="success" size="mini" @click="openEdit"
          >新 增</el-button
        >
        <el-button type="danger" size="mini" @click="deleteData"
          >删 除</el-button
        >
      </div>
      <div class="table-cont">
        <el-table
          ref="dataTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
          border
          stripe
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column prop="user_name" label="登录名"></el-table-column>
          <el-table-column prop="cn_name" label="用户姓名"></el-table-column>
          <el-table-column
            prop="group_id"
            label="组"
            :formatter="groupFormatter"
          ></el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
            :formatter="roleFormatter"
          ></el-table-column>
          <el-table-column prop="edit_time" label="更新时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="openEdit(scope.row)"
                :disabled="scope.row.id === 1"
                >修改</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="deleteData(scope.row)"
                :disabled="scope.row.id === 1 || scope.row.id === selfId"
                >删除</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="openResetPass(scope.row)"
                :disabled="scope.row.id === 1"
                >重置密码</el-button
              >
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
            :total="totalData"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <EditUser
      v-if="dialogs.editDlgShow"
      :userData="editUserData"
      :areaData="areaData"
      @close="closeDlg"
      @updateData="getTableData"
    ></EditUser>
    <ResetPassword
      v-if="dialogs.resetDlgShow"
      :userData="resetUserData"
      @close="closeDlg"
      @updateData="getTableData"
    ></ResetPassword>
  </div>
</template>

<script>
import EditUser from "./EditUser";
import ResetPassword from "./ResetPassword";
import api from "@/api/common.api.js";
export default {
  name: "User",
  components: {
    EditUser,
    ResetPassword,
  },
  data() {
    return {
      loading: false,
      dialogs: {
        editDlgShow: false, // 编辑弹框显隐
        resetDlgShow: false, // 重置密码弹框显隐
      },
      areaData: [], // 区域数据
      searchForm: {
        loginName: "",
        userName: "",
        groupId: "",
        currentUser: "",
        isAllGroup: false,
        pageNum: 1,
        pageSize: 15,
      },
      editUserData: {}, // 编辑时传入用户信息
      resetUserData: {}, // 重置密码时传入用户信息

      selectDatas: [], // 选中的数据
      tableData: [],
      totalData: 0,
    };
  },
  computed: {
    selfId() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      return userInfo.id;
    },
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.groupId = userInfo.groupId;
    this.searchForm.currentUser = userInfo.user_name;
    //this.getAreaData()
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 获取表格数据
      let params = this.searchForm;
      this.loading = true;
      await api.user.getUserList(params).then((res) => {
        this.loading = false;
        this.totalData = res.count;
        this.tableData = res.data;
      });
    },
    selectable(row, index) {
      return row.id === 1 || row.id === this.selfId ? false : true;
    },

    async getAreaData() {
      // 获取区域数据
      let params = {
        areaCode: this.searchForm.currentUserArea,
        currentUser: this.searchForm.currentUser,
      };
      await api.resources.getAreaInfo(params).then((res) => {
        let that = this;
        that.areaData = res;
      });
    },
    groupFormatter(row, column, cellValue) {
      // 渲染区域列
      let groupName = "";
      if (row.groups)
        row.groups.forEach((item) => {
          groupName += item.name + ",";
        });
      return groupName && groupName.substring(0, groupName.length - 1);
    },
    roleFormatter(row, column, cellValue) {
      // 渲染区域列
      return row.role.role_name;
    },
    handleSelectionChange(val) {
      // 暂存选中数据
      this.selectDatas = val;
    },

    deleteData(val) {
      if (this.selectDatas.length < 1 && !val.id) {
        this.$message({
          message: "请选择需要删除的数据！",
          type: "warning",
        });
        return false;
      }
      let tip = val.id ? "是否删除本条数据？" : "是否删除所选数据？";
      let ids = val.id
        ? [val.id]
        : this.selectDatas.map((i) => {
            return i.id;
          });
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteUser(ids).then((res) => {
          this.getTableData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    async deleteUser(ids) {
      // 删除用户信息
      await api.user.deleteUser({ ids });
    },

    openEdit(data) {
      // 打开编辑/新增弹框
      if (data.id) {
        this.editUserData = data;
      } else {
        this.editUserData = {};
      }
      this.dialogs.editDlgShow = true;
    },
    openResetPass(data) {
      // 打开重置密码弹框
      this.resetUserData = data;
      this.dialogs.resetDlgShow = true;
    },
    closeDlg(val) {
      // 关闭弹框方法
      this.dialogs[val] = false;
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
      // 重置
      this.searchForm.loginName = "";
      this.searchForm.userName = "";
      this.getTableData();
    },
  },
};
</script>
