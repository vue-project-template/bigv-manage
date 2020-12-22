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
            @change="getRoomData"
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
            v-model="searchForm.roomId"
            filterable
            @change="getFrameData"
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
          <el-select
            size="small"
            v-model="searchForm.frameId"
            filterable
            placeholder="机架名称"
          >
            <el-option
              v-for="item in frameData"
              :key="item.frame_id"
              :label="item.frame_name"
              :value="item.frame_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.deviceName"
            placeholder="设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="searchForm.deviceCode"
            placeholder="设备编码"
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
      <!-- <div class="table-btns">
        <el-button type="success" size="mini" @click="openEdit"
          >新 增</el-button
        >
        <el-button type="danger" size="mini" @click="deleteData"
          >删 除</el-button
        >
      </div> -->
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
          <el-table-column prop="area_name" label="区域名称"></el-table-column>
          <el-table-column
            prop="subarea_name"
            label="子区域名称"
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
            prop="frame_name"
            label="机架名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="device_name"
            label="设备名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="device_code"
            label="设备编码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="device_company"
            label="设备厂家"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="device_group_name"
            label="集团名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="openEdit(scope.row, 'readOnly')"
                >查看</el-button
              >
              <!-- <el-button
                type="text"
                size="mini"
                @click="openEdit(scope.row)"
                :disabled="scope.row.system_code === 0"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="deleteData(scope.row)"
                :disabled="scope.row.system_code === 0"
                >删除</el-button
              > -->
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
    <EditEquipment
      v-if="dialogs.editDlgShow"
      :eqData="editEqData"
      @close="closeDlg"
      @updateData="getTableData"
    ></EditEquipment>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
import EditEquipment from "./EditEquipment";
export default {
  name: "Cabinet",
  components: {
    EditEquipment,
  },
  data() {
    return {
      loading: false,
      searchForm: {
        groupId: "",
        userName: "",
        areaId: "",
        subareaId: "",
        siteId: "",
        roomId: "",
        frameId: "",
        deviceName: "",
        deviceCode: "",
        pageNum: 1,
        pageSize: 15,
      },
      tableData: [],
      totalData: 0,
      selectDatas: [], // 选中的数据

      areaData: [], // 区域数据
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      roomData: [], // 站点下机房信息数据
      frameData: [], // 机架信息数据
      deviceData: [], // 设备信息下拉数据

      dialogs: {
        editDlgShow: false,
      },
      editEqData: {},
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.groupId = userInfo.groupId;
    this.searchForm.userName = userInfo.user_name;
    this.getAreaData();
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 获取表格数据
      let params = this.searchForm;
      this.loading = true;
      await api.resources.getDevicePagingInfo(params).then((res) => {
        this.loading = false;
        let that = this;
        that.totalData = res.cnt;
        that.tableData = res.list;
      });
    },
    selectable(row, index) {
      return row.system_code === 0 ? false : true;
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
      this.searchForm.roomId = "";
      this.searchForm.frameId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        areaId: val,
      };
      await api.resources.getSubareaInfo(params).then((res) => {
        this.subAreaData = res;
        this.siteData = this.roomData = this.frameData = [];
      });
    },
    async getSiteData(val) {
      // 获取站点信息数据
      this.searchForm.siteId = "";
      this.searchForm.roomId = "";
      this.searchForm.frameId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        subareaId: val,
      };
      await api.resources.getSiteInfo(params).then((res) => {
        this.siteData = res;
        this.roomData = this.frameData = [];
      });
    },
    async getRoomData(val) {
      // 获取站点下机房信息数据
      this.searchForm.roomId = "";
      this.searchForm.frameId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        siteId: val,
      };
      await api.resources.getRoomInfo(params).then((res) => {
        this.roomData = res;
        this.frameData = [];
      });
    },
    async getFrameData(val) {
      // 获取机架信息数据
      this.searchForm.frameId = "";
      let params = {
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        roomId: val,
      };
      await api.resources.getFrameInfo(params).then((res) => {
        this.frameData = res;
      });
    },
    handleSelectionChange(val) {
      // 暂存选中数据
      this.selectDatas = val;
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
        roomId: "",
        frameId: "",
        deviceName: "",
        deviceCode: "",
        pageNum: 1,
        pageSize: 15,
      }),
        this.getTableData();
    },
    openEdit(data, type) {
      // 打开关联弹框
      if (data.id) {
        this.editEqData = data;
        this.editEqData.readOnly = type || "";
      } else {
        this.editEqData = {};
      }
      this.dialogs.editDlgShow = true;
    },
    closeDlg(val) {
      // 关闭弹框方法
      this.dialogs[val] = false;
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
      let deviceIds = val.id
        ? [val.id]
        : this.selectDatas.map((i) => {
            return i.id;
          });
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteDevice(deviceIds);
        this.$message({
          type: "success",
          message: "已和机架解除关系!",
        });
        this.getTableData();
      });
    },
    async deleteDevice(deviceIds) {
      // 删除设备信息
      await api.resources.deleteDevice({ deviceIds });
    },
  },
};
</script>
