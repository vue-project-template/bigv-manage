<template>
  <div id="linkEquipment">
    <el-dialog
      title="关联设备"
      :visible="true"
      width="60%"
      :before-close="close"
    >
      <el-row >
        <el-col :span="24" class="transfer">
          <el-transfer
            v-model="linkingDeviceIds"
            :data="allUnbindDevice"
            filterable
            size="mini"
            :titles="['未关联设备', '已关联设备']"
            :props="{ key: 'device_id', label: 'device_name' }"
            class="transfer-center"
          >
              <span slot-scope="{ option }">
                <el-tooltip  :content="option.device_name" placement="right">
                  <span>{{ option.device_name }}</span>
                </el-tooltip>
              </span>
          </el-transfer>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $lodash from "lodash";
import api from "@/api/common.api.js";
export default {
  props: {
    frameData: {
      // 传入机架信息
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      allUnbindDevice: [], // 机房下所有未关联设备
      linkedDevice: [], // 该机架已关联设备
      linkingDeviceIds: [], // 该机架待关联设备id集合
      linkedDeviceIds: [], // 该机架已关联的设备id集合
    };
  },
  created() {
    this.getUnbindDeviceInfo();
    this.getBindDeviceByFrameId();
  },
  methods: {
    // 获取已关联的设备
    async getBindDeviceByFrameId() {
      this.linkedDevice = await api.resources.getBindDeviceByFrameId({
        frameId: this.frameData.frame_id
      });
      this.linkedDeviceIds = this.linkedDevice.map((i) => {
        return i.device_id;
      });
      this.linkingDeviceIds = $lodash.cloneDeep(this.linkedDeviceIds);
    },
    async getUnbindDeviceInfo() {
      let allUnbindDevice = await api.resources.getUnbindDeviceByRoomId({
        roomId: this.frameData.room_id,
      });
      this.allUnbindDevice = allUnbindDevice.concat(this.linkedDevice);
    },
    submit() {
      let add = [], del = [];
      this.linkingDeviceIds.forEach(id => {
        if (this.linkedDeviceIds.indexOf(id) === -1) {
          add.push(id);
        }
      });
      this.linkedDeviceIds.forEach(id => {
        if (this.linkingDeviceIds.indexOf(id) === -1) {
          del.push(id);
        }
      });
      if (add.length > 0 || del.length > 0) {
        this.$confirm("请确认是否添加机架与设备的关联关系？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.associationDevice(add, del).then((res) => {
            this.$emit("updateData");
            this.close();
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "无可提交的更改!",
        });
      }
    },
    async associationDevice(add, del) {
      await api.resources.updateFrameBindDevices({
        frameId: this.frameData.frame_id,
        addList: add,
        delList: del
      })
    },
    close() {
      this.$emit("close", "linkDlgShow");
    },
  },
};
</script>

<style lang="less">
.transfer-center {

  display: flex;
  justify-content: center;
  align-items: center;
}
#linkEquipment{
  .el-transfer-panel{
    width: 40%;
  }
  .transfer{
    .el-button--primary{
      width: 40px;
      height: 37px;
    }
  }
}
/*.el-dialog__body,.el-row,.el-col-24,.el-transfer.transfer-center,.el-transfer-panel..el-transfer-panel__body{*/
/*  height: 100%;*/
/*}*/

</style>
