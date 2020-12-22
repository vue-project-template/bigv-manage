<template>
  <div>
    <el-dialog
      :title="dlgTitle"
      :visible="true"
      width="50%"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <el-form
        class="submit-form"
        :model="submitForm"
        :rules="submitRules"
        ref="submitForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="策略名称"
              prop="policyName"
              label-width="100px"
            >
              <el-input
                size="small"
                v-model="submitForm.policyName"
                :disabled="readOnly"
                placeholder="请输入策略名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="策略类型" prop="alarmType" label-width="100px">
              <el-select
                size="small"
                v-model="submitForm.alarmType"
                filterable
                :disabled="readOnly"
                placeholder="请选择告警类型"
              >
                <el-option
                  v-for="item in alarmTypeOp"
                  :key="item.alarm_code"
                  :label="item.alarm_name"
                  :value="item.alarm_code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime" label-width="100px">
              <el-date-picker
                v-model="submitForm.startTime"
                size="small"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsStart"
                :disabled="readOnly"
                placeholder="请选择开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime" label-width="100px">
              <el-date-picker
                v-model="submitForm.endTime"
                size="small"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsEnd"
                :disabled="readOnly"
                placeholder="请选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item
              label="选择摄像头"
              class="is-required"
              label-width="100px"
            >
              <div class="camera-box">
                <div class="search-tree">
                  <el-input
                    placeholder="搜索"
                    size="mini"
                    v-model="filterTreeText"
                    @keyup.enter.native="filterTree"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="filterTree"
                    ></el-button>
                  </el-input>
                  <elTree2
                    class="filter-tree"
                    :data="cameraTreeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    node-key="code"
                    :check-strictly="true"
                    show-checkbox
                    nodeFilter="this.node.data.level === 6"
                    :default-checked-keys="submitForm.channelIds"
                    :default-expanded-keys="submitForm.channelIds"
                    ref="cameraTree"
                    v-loading="loadingTree"
                    :emptyText="emptyText"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                  >
                  </elTree2>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="备注" label-width="100px">
              <el-input
                type="textarea"
                :disabled="readOnly"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入备注内容"
                v-model="submitForm.desc"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!readOnly">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $lodash from "lodash";
import api from "@/api/common.api.js";
import elTree2 from "@/components/common/tree/src/tree.vue";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
  components: {
    elTree2,
  },
  props: {
    alarmData: {
      // 传入告警策略信息
      type: Object,
    },
  },
  watch: {
    // filterTreeText(val) {
    //   this.$refs.cameraTree.filter(val);
    // }
  },
  data() {
    return {
      searchForm: {
        userId: "",
      },
      submitForm: {
        policyName: "",
        policyCode: "",
        policyType: "0",
        alarmType: "",
        startTime: "",
        endTime: "",
        channelIds: [],
        desc: "",
      },
      submitRules: {
        policyName: [
          { required: true, message: "请输入策略名称", trigger: "blur" },
        ],
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
      },

      pickerOptionsStart: {
        disabledDate: (currentTime) => {
          // 开始时间禁用时间段
          let endDateVal = this.submitForm.endTime;
          if (endDateVal) {
            // 如果已经选择了结束时间
            // 禁用结束日期的之后时间
            return currentTime.getTime() > new Date(endDateVal).getTime();
          }
          // 禁用当前时间的之后时间（加载组件就会开启禁用）
          // return currentTime.getTime() > new Date().getTime()
        },
      },
      pickerOptionsEnd: {
        disabledDate: (currentTime) => {
          // 结束时间禁用时间段
          let beginDateVal = this.submitForm.startTime;
          if (beginDateVal) {
            // 如果已经选择了开始时间
            // 禁用开始日期的之前时间  和 禁用今天之后的日期
            return currentTime.getTime() < new Date(beginDateVal).getTime();
            //  || currentTime.getTime() > new Date().getTime()
          }
          // 禁用当前时间的之后时间（加载组件就会开启禁用）
          // return currentTime.getTime() > new Date().getTime()
        },
      },

      areaCode: "",
      currentUser: "",
      alarmTypeOp: [], // 策略类型下拉数据
      cameraTreeData: [], // 摄像头树数据
      filterTreeText: "",
      defaultProps: {
        children: "children",
        label: "name",
        disabled: (data, node) => {
          if (this.readOnly) {
            return node.level === 5;
          }
        },
      },
      loadingTree: false,
      emptyText: "",
    };
  },
  computed: {
    dlgTitle() {
      let title = "";
      if (this.alarmData.id) {
        if (this.alarmData.readOnly) {
          title = "查看策略";
        } else {
          title = "编辑策略";
        }
      } else {
        title = "新增策略";
      }
      return title;
    },
    readOnly() {
      return this.alarmData.readOnly ? true : false;
    },
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.searchForm.userId = userInfo.id;
    if (this.alarmData.id) {
      // 判断编辑还是新增
      this.submitForm = {
        policyName: this.alarmData.policy_name,
        policyCode: this.alarmData.policy_code,
        policyType: this.alarmData.policy_type,
        alarmType: Number(this.alarmData.alarm_type_code),
        startTime: this.alarmData.start_time,
        endTime: this.alarmData.end_time,
        desc: this.alarmData.des,
      };
      this.getAlarmPolicyById({
        id: this.alarmData.id,
        policyCode: this.alarmData.policy_code,
      });
    } else {
      // 新增策略生成唯一code
      this.submitForm.policyCode =
        new Date().getTime() +
        "-" +
        this.S4() +
        "-" +
        this.S4() +
        "-" +
        this.S4() +
        this.S4();
    }
    this.getResCameraTree();
    this.getAlarmPolicyType();
  },
  methods: {
    filterTree() {
      if (this.filterTreeText)
        this.$refs.cameraTree.filter(this.filterTreeText);
      else
        this.cameraTreeData = JSON.parse(JSON.stringify(this.cameraTreeData));
    },
    S4() {
      // 随机生成四位16进制数
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    async getResCameraTree(params) {
      this.loadingTree = true;
      // 获取摄像头树结构
      await api.resources.getResCameraTree(params).then((res) => {
        this.filteringData(res[0], res[0].children);
        this.cameraTreeData = res;
        this.loadingTree = false;
        if (ArrayUtils.isEmpty(this.cameraTreeData)) {
          this.emptyText = "暂无数据";
        }
      });
    },
    filteringData(item, children) {
      let childs = [];
      children.map((child) => {
        if (item.level == 4) {
          childs = childs.concat(child.children);
        } else {
          if (child.children) this.filteringData(child, child.children);
        }
      });
      if (childs.length && item.level === 4) {
        item.children = childs;
      }
    },

    async getAlarmPolicyById(params) {
      // 根据id、code查询告警策略接口
      await api.alarm.getAlarmPolicyById(params).then((res) => {
        let that = this;
        that.submitForm.channelIds =
          res.channel_ids.length > 0 &&
          res.channel_ids.map((i) => {
            return i.channel_id;
          });
      });
    },
    //模糊搜索的过滤
    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (
        data.name.indexOf(value) !== -1 ||
        (data.channel_ip && data.channel_ip.indexOf(value) !== -1)
      ) {
        return true;
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.name.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },

    async getAlarmPolicyType() {
      // 获取告警类型
      await api.alarm.getAlarmPolicyType().then((res) => {
        let that = this;
        that.alarmTypeOp = res;
      });
    },

    submit() {
      this.$refs["submitForm"].validate((valid) => {
        let channelIds = this.$refs.cameraTree.getCheckedKeys();
        if (channelIds.length < 1) {
          this.$message({
            type: "error",
            message: "请选择摄像头!",
          });
          return false;
        }
        if (valid) {
          this.$confirm("请确认是否提交！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.alarmData.id
              ? this.editAlarmPolicy(this.submitForm).then((res) => {
                  this.$emit("updateData");
                  this.close();
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                })
              : this.addAlarmPolicy(this.submitForm).then((res) => {
                  this.$emit("updateData");
                  this.close();
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                });
          });
        } else {
          return false;
        }
      });
    },

    async addAlarmPolicy(params) {
      // 新增策略
      params.userId = this.searchForm.userId;
      params.channelIds = this.$refs.cameraTree.getCheckedKeys();
      await api.alarm.addAlarmPolicy(params);
    },
    async editAlarmPolicy(params) {
      // 修改策略信息
      params.userId = this.searchForm.userId;
      params.channelIds = this.$refs.cameraTree.getCheckedKeys();
      await api.alarm.editAlarmPolicy(params);
    },

    close() {
      this.$emit("close", "editDlgShow");
    },
  },
};
</script>

<style lang="less" scoped>
.search-tree {
  width: 380px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
</style>
