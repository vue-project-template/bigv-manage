<template>
  <div id="linkFrame">
    <el-dialog title="关联摄像头" :visible="true" width="60%" :before-close="close" :close-on-click-modal="false">
        <el-row>
          <el-col :span="24" class="transfer">
            <el-transfer 
            v-model="channelIds"
            :data="allChannelData"
            filterable
            :titles="['未关联摄像头', '已关联摄像头']"
            :props="{key: 'channel_id', label: 'channel_name'}"
            class="transfer-center">
              <span slot-scope="{ option }">
                <el-tooltip  :content="option.channel_name" placement="right">
                  <span>{{ option.channel_name }}</span>
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
import api from "@/api/common.api.js"
import $lodash from 'lodash'
export default {
  props: {
    accessId: { // 门禁id
      type: String,
      required: true
    },roomId: { // 机房id
      type: Number ,
      required: true
    }
  },
  data() {
    return {
      allChannelData: [], // 门禁下所有摄像头信息数据
      relationChannel: [], // 摄像头下已关联摄像头信息数据
      channelIds: [],
      cloneChannelIds: []
    }
  },

  created() {
    this.getBindChannelByAccessId({accessId: this.accessId});
    this.getAllChannelIdByRoomId({roomId: this.roomId});
  },
  methods: {
    async getAllChannelIdByRoomId(params) { // 获取全部摄像头
      await api.resources.getAllChannelIdByRoomId(params).then(res => {
        this.allChannelData=res;

      })
    },
    async getBindChannelByAccessId(params) { // 获取已关联的摄像头
      await api.resources.getChannelIdByAccessId(params).then(res => {
        this.channelIds = res.map(i => {
          return i.channelId
        });
        this.cloneChannelIds = $lodash.cloneDeep(this.channelIds)
      })
    },

    submit() {
      if (this.channelIds.join(',') !== this.cloneChannelIds.join(',')) {
        this.$confirm('请确认是否修改摄像头机架关联关系？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveAccessChannelRel().then(res => {
            this.close()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '无可提交的更改!'
        })
      }
    },

    async saveAccessChannelRel() { // 摄像头关联机架
      let params = {
        channelIds: this.channelIds,
        accessId: this.accessId
      };
      await api.resources.saveAccessChannelRel(params)
    },

    close() {
      this.$emit('close', 'relationChannel')
    }
  }
}
</script>

<style  lang="less">
  #linkFrame{
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
.transfer-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
