<template>
  <div id="linkFrame">
    <el-dialog
      title="关联机架"
      :visible="true"
      width="60%"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="24" class="transfer">
          <el-transfer
            v-model="linkedFrameIds"
            :data="allFrameData"
            filterable
            :titles="['未关联机架', '已关联机架']"
            :props="{ key: 'frame_id', label: 'frame_name' }"
            class="transfer-center"
          >
            <span slot-scope="{ option }">
              <el-tooltip :content="option.frame_name" placement="right">
                <span>{{ option.frame_name }}</span>
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
import api from "@/api/common.api.js";
import $lodash from "lodash";
export default {
  props: {
    channelId: {
      // 传入通道id
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allFrameData: [], // 摄像头下所有机架信息数据
      linkedFrame: [], // 摄像头下已关联机架信息数据
      linkedFrameIds: [],
      cloneFrameIds: [],
    };
  },

  created() {
    this.getFrameListByChannelId({ channelId: this.channelId });
    this.getUnbindFrameByChannelId({ channelId: this.channelId });
  },
  methods: {
    getFrameListByChannelId(params) {
      // 获取已关联的机架
      api.resources.getFrameListByChannelId(params).then((res) => {
        let that = this;
        that.linkedFrame = res;
        that.linkedFrameIds = res.map((i) => {
          return i.frame_id;
        });
        that.cloneFrameIds = $lodash.cloneDeep(that.linkedFrameIds);
      });
    },
    getUnbindFrameByChannelId(params) {
      // 获取未关联的机架
      api.resources.getUnbindFrameByChannelId(params).then((res) => {
        let that = this;
        that.allFrameData = res.concat(this.linkedFrame);
      });
    },

    submit() {
      if (this.linkedFrameIds.join(",") !== this.cloneFrameIds.join(",")) {
        this.$confirm("请确认是否修改摄像头机架关联关系？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.associationFrame().then((res) => {
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

    async associationFrame() {
      // 摄像头关联机架
      let params = {
        frameIds: this.linkedFrameIds,
        channelId: this.channelId,
      };
      await api.resources.associationFrame(params);
    },

    close() {
      this.$emit("close", "linkDlgShow");
    },
  },
};
</script>

<style lang="less">
#linkFrame {
  .el-transfer-panel {
    width: 40%;
  }
  .transfer {
    .el-button--primary {
      width: 40px;
      height: 37px;
    }
  }
}
.transfer-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
