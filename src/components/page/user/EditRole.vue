<template>
  <div>
    <el-dialog
      :title="dlgTitle"
      :visible="true"
      width="30%"
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
          <el-col :span="18">
            <el-form-item label="角色code" prop="roleCode" label-width="100px">
              <el-input
                size="small"
                v-model="submitForm.roleCode"
                auto-complete="off"
                :disabled="!!roleData.id"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="角色名" prop="roleName" label-width="100px">
              <el-input
                size="small"
                v-model="submitForm.roleName"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="级别" prop="roleLevel" label-width="100px">
              <el-select
                v-model="submitForm.roleLevel"
                size="small"
                placeholder="0为最高级别"
                @change="changeLevel"
              >
                <el-option
                  v-for="lev in roleLevOptions"
                  :key="lev.code"
                  :label="lev.label"
                  :value="lev.code"
                  :disabled="lev.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="菜单权限"
              class="is-required"
              label-width="100px"
            >
              <el-tree
                :data="privilegeData"
                show-checkbox
                ref="privilegesTree"
                node-key="privilege_code"
                :default-expand-all="true"
                :props="defaultProps"
              >
              </el-tree>
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
import $lodash from "lodash";
import api from "@/api/common.api.js";
let _level = { val: 0 };
export default {
  props: {
    roleData: {
      // 传入角色信息
      type: Object,
    },
  },
  data() {
    return {
      submitForm: {
        roleCode: "", // 角色code
        roleName: "", // 角色名
        privileges: [], // 菜单权限
        roleLevel: "",
      },
      submitRules: {
        roleCode: [
          { required: true, message: "请输入角色ID", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleLevel: [
          { required: true, message: "请选择角色级别", trigger: "blur" },
        ],
      },
      privilegeData: [],
      defaultProps: {
        children: "children",
        label: "privilege_name",
        disabled: "disabled",
      },
      roleLevOptions: [],
    };
  },
  computed: {
    dlgTitle() {
      return this.roleData.id ? "编辑信息" : "新增角色";
    },
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let level = userInfo.role_level;
    for (let i = 0; i < 6; i++) {
      let disabled = i >= level ? false : true;
      this.roleLevOptions.push({ code: i, label: i, disabled });
    }
    if (this.roleData.id) {
      this.submitForm = {
        roleCode: this.roleData.role_code, // 角色code
        roleName: this.roleData.role_name, // 角色名
        roleLevel: this.roleData.level, // 角色级别
        privileges: this.roleData.privilege_code.split(","), // 菜单权限
      };
    }
    this.getPrivilegeTree();
  },
  mounted() {},

  methods: {
    async getPrivilegeTree() {
      // 获取权限列表树结构
      await api.user.getPrivilegeTree().then((res) => {
        this.privilegeData = res;
        this.$nextTick(() => {
          this.sethalf(); // 设置节点选择（处理半选问题）
        });
        this.changeLevel();
      });
    },
    sethalf() {
      // 设置节点选择（处理半选问题）
      var that = this;
      this.roleData.privilege_code &&
        this.roleData.privilege_code.split(",").forEach((i) => {
          var node = that.$refs.privilegesTree.getNode(i);
          if (node.isLeaf) {
            // isLeaf为false时表示半选，不选中
            that.$refs.privilegesTree.setChecked(node, true);
          }
        });
    },

    submit() {
      this.$refs["submitForm"].validate((valid) => {
        let privileges = this.$refs.privilegesTree.getCheckedKeys();
        let half = this.$refs.privilegesTree.getHalfCheckedKeys();
        privileges = privileges.concat(half);
        if (privileges.length < 1) {
          this.$message({
            type: "error",
            message: "请选择菜单权限!",
          });
          return false;
        }
        if (valid) {
          this.$confirm("请确认是否提交！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.roleData.id
              ? this.editRole(this.submitForm).then((res) => {
                  this.$emit("updateData");
                  this.close();
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                })
              : this.addRole(this.submitForm).then((res) => {
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
    async addRole(params) {
      // 新增角色
      let half = this.$refs.privilegesTree.getHalfCheckedKeys();
      params.privileges = this.$refs.privilegesTree
        .getCheckedKeys()
        .concat(half);
      await api.user.addRole(params);
    },
    async editRole(params) {
      // 修改角色
      params.id = this.roleData.id;
      let half = this.$refs.privilegesTree.getHalfCheckedKeys();
      params.privileges = this.$refs.privilegesTree
        .getCheckedKeys()
        .concat(half);
      await api.user.editRole(params);
    },

    close() {
      this.$emit("close", "editDlgShow");
    },
    changeLevel() {
      let privilegeData = JSON.parse(JSON.stringify(this.privilegeData));
      for (
        let i = 0, len = privilegeData ? privilegeData.length : 0;
        i < len;
        i++
      ) {
        let pdata = privilegeData[i];
        if (pdata.privilege_code === "userManager") {
          for (
            let j = 0, lth = pdata.children ? pdata.children.length : 0;
            j < lth;
            j++
          ) {
            let child = pdata.children[j];
            if (
              child.privilege_code === "role" &&
              this.submitForm.roleLevel !== 0
            ) {
              child.disabled = true;
            } else {
              child.disabled = false;
            }
          }
        }
      }
      this.privilegeData = privilegeData;
      this.$nextTick(() => {
        this.sethalf(); // 设置节点选择（处理半选问题）
      });
    },
  },
};
</script>
