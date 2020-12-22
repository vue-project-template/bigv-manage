<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.roleCode"
            placeholder="角色code"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.roleName"
            placeholder="角色名"
          ></el-input>
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
          <el-table-column prop="role_code" label="角色code"></el-table-column>
          <el-table-column prop="role_name" label="角色名"></el-table-column>
          <el-table-column
            prop="privilege_name"
            label="菜单权限"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="edit_time"
            sortable
            label="更新时间"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="openEdit(scope.row)"
                :disabled="scope.row.role_code === '0'"
                >修改</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="deleteData(scope.row)"
                :disabled="scope.row.role_code === '0'"
                >删除</el-button
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
    <EditRole
      v-if="dialogs.editDlgShow"
      :roleData="editRoleData"
      @close="closeDlg"
      @updateData="getTableData"
    ></EditRole>
  </div>
</template>

<script>
import EditRole from "./EditRole";
import api from "@/api/common.api.js";
export default {
  name: "Role",
  components: {
    EditRole,
  },
  data() {
    return {
      loading: false,
      dialogs: {
        editDlgShow: false, // 编辑弹框显隐
      },
      searchForm: {
        roleCode: "",
        roleName: "",
        pageNum: 1,
        pageSize: 15,
      },
      editRoleData: {}, // 编辑时传入角色信息

      selectDatas: [], // 选中的数据
      tableData: [],
      totalData: 0,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 获取表格数据
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      let params = this.searchForm;
      params.roleLevel = userInfo.role_level;
      this.loading = true;
      await api.user.getRoleList(params).then((res) => {
        this.loading = false;
        this.totalData = res.count;
        this.tableData = res.data;
      });
    },
    selectable(row, index) {
      return row.role_code === "0" ? false : true;
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
      let tip = val.id
        ? "角色code被绑定后将不能被删除，是否删除本条数据？"
        : "角色code被绑定后将不能被删除，是否删除所选数据？";
      let codes = val.id
        ? [val.role_code]
        : this.selectDatas.map((i) => {
            return i.role_code;
          });
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteRole(codes).then((res) => {
          if (res === null) {
            this.$message({
              type: "error",
              message: "删除失败!",
            });
          } else {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableData();
          }
        });
      });
    },
    async deleteRole(codes) {
      // 删除角色信息
      return await api.user.deleteRole({ roleCodes: codes });
    },

    openEdit(data) {
      // 打开编辑/新增弹框
      if (data.id) {
        this.editRoleData = data;
      } else {
        this.editRoleData = {};
      }
      this.dialogs.editDlgShow = true;
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
      this.searchForm = {
        roleCode: "",
        roleName: "",
        pageNum: 1,
        pageSize: 15,
      };
      this.getTableData();
    },
  },
};
</script>
