<template>
  <div>
    <el-dialog
      :title="dlgTitle"
      :visible="true"
      :close-on-click-modal="false"
      width="30%"
      :before-close="close"
    >
      <el-form
        class="submit-form"
        :model="submitForm"
        :rules="submitGroups"
        ref="submitForm"
      >
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="组名"
              prop="name"
              label-width="100px"
              class="is-required"
            >
              <el-input
                size="small"
                v-model="submitForm.name"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="权限分配"
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
                    ><el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="filterTree"
                    ></el-button
                  ></el-input>
                  <el-tree
                    class="filter-tree"
                    :data="cameraTreeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @check="treeCheck"
                    show-alpha="true"
                    show-checkbox
                    node-key="code"
                    :default-checked-keys="defaultExpanded"
                    :default-expanded-keys="defaultExpanded"
                    ref="cameraTree"
                    v-loading="loadingTree"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    :empty-text="emptyText"
                  >
                    <span style="font-size:14px;" slot-scope="{ node, data }">
                      <el-tooltip :content="data.name" placement="right">
                        <span>{{ data.name }}</span>
                      </el-tooltip>
                    </span>
                  </el-tree>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
  props: {
    groupData: {
      // 传入角色信息
      type: Object,
    },
  },
  data() {
    return {
      defaultExpanded: [],
      filterTreeText: "",
      cameraTreeData: [], // 摄像头树数据
      submitForm: {
        id: "",
        name: "", // 组名
        node: [], // 树权限
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      submitGroups: {
        name: [{ required: true, message: "请组名称", trigger: "blur" }],
      },
      loadingTree: false,
      emptyText: ""
    };
  },
  watch: {
    // filterTreeText(val) {
    //   this.$refs.cameraTree.filter(val);
    // },
  },
  computed: {
    dlgTitle() {
      return this.groupData.id ? "编辑信息" : "新增组";
    },
  },
  created() {
    /*if(this.roleData.id) {
      this.submitForm = {
        roleCode: this.roleData.role_code, // 角色code
        roleName: this.roleData.role_name, // 角色名
        privileges: this.roleData.privilege_code.split(','), // 菜单权限
      }
    }*/
  },
  mounted() {
    if (this.groupData.id) {
      this.submitForm.id = this.groupData.id;
      this.submitForm.name = this.groupData.name;
      // this.submitForm.node=this.groupData.node.map(item=>{
      //   return {nodeCodes:[item.nodeCodes],path:item.path};
      // });
      this.defaultExpanded = this.groupData.node.map((item) => {
        return item.nodeCodes;
      });
    }
    this.getResCameraTree();
  },

  methods: {
    filterTree() {
      if (this.filterTreeText)
        this.$refs.cameraTree.filter(this.filterTreeText);
      else
        this.cameraTreeData = JSON.parse(JSON.stringify(this.cameraTreeData));
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
    treeCheck() {
      let getCheckedNodes = this.$refs.cameraTree.getCheckedNodes();
      let getHalfCheckedNodes = this.$refs.cameraTree.getHalfCheckedNodes();
      let checkedNodes = getHalfCheckedNodes.concat(getCheckedNodes);
      let node = [];
      getCheckedNodes.forEach((item) => {
        let code = item.parent_code;
        let path = "";
        if (item.level !== 6) {
          for (let i = checkedNodes.length - 1; i >= 0; i--) {
            if (checkedNodes[i].level !== 6 && checkedNodes[i].code === code) {
              path = checkedNodes[i].code + "/" + path;
              if (checkedNodes[i].parent_code)
                code = checkedNodes[i].parent_code;
              else if(item.level === 5 || !item.children){
                let checkMap = {};
                checkMap.path = path;
                checkMap.nodeCodes = [];
                checkMap.nodeCodes.push(item.code);
                node.push(checkMap);
                break;
              }
            }
          }
        }
      });
      this.submitForm.node = node;
    },
    async getResCameraTree() {
      // 获取摄像头树结构
      this.loadingTree = true;
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      await api.resources
        .getResCameraTree({ user_name: userInfo.user_name, showAll: 0 })
        .then((res) => {
          this.cameraTreeData = res;
          this.loadingTree = false;
          if (ArrayUtils.isEmpty(this.cameraTreeData)) {
            this.emptyText = '暂无数据';
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

    submit() {
      this.treeCheck();
      this.$refs["submitForm"].validate((valid) => {
        if (valid) {
          this.$confirm("请确认是否提交！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.groupData.id
              ? this.updateGroup(this.submitForm).then((res) => {
                  this.$emit("updateData");
                  this.close();
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                })
              : this.addGroup(this.submitForm).then((res) => {
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
    async addGroup(params) {
      // 新增角色
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      params.parentId = userInfo.groupId;
      await api.user.addGroup(params);
    },
    async updateGroup(params) {
      // 新增角色
      await api.user.updateGroup(params);
    },

    close() {
      this.$emit("close", "editDlgShow");
    },
  },
};
</script>
<style lang="less">
.el-loading-mask {
  line-height: 20px;
}
</style>
