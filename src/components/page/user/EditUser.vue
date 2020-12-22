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
            <el-form-item label="登录名" prop="userName" label-width="100px">
              <el-tooltip
                class="item"
                effect="dark"
                content="登录名不能重复；若重复，则创建不成功!"
                placement="top"
              >
                <el-input
                  size="small"
                  v-model="submitForm.userName"
                  auto-complete="off"
                  :disabled="!!userData.id"
                  @focus="filterData"
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="用户姓名" prop="cnName" label-width="100px">
              <el-input
                size="small"
                v-model="submitForm.cnName"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="密码" prop="pwd" label-width="100px">
              <el-input
                size="small"
                :type="passwordType"
                v-model="submitForm.pwd"
                auto-complete="new-password"
                :disabled="!!userData.id"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-view"
                  @click="passwordType = passwordType ? '' : 'password'"
                ></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="角色" prop="roleCode" label-width="100px">
              <el-select
                size="small"
                v-model="submitForm.roleCode"
                placeholder="请选择角色"
                @focus="filterData"
              >
                <el-option
                  v-for="item in roleDatas"
                  :key="item.role_code"
                  :label="item.role_name"
                  :value="item.role_code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="组权限分配"
              prop="group_id"
              label-width="100px"
            >
              <el-select
                size="small"
                v-model="submitForm.groupId"
                placeholder="请选择组"
              >
                <el-option
                  v-for="item in groupData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
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
import CryptoJS from "crypto-js";
import api from "@/api/common.api.js";

export default {
  props: {
    userData: {
      // 传入用户信息
      type: Object,
    },
  },
  data() {
    return {
      submitForm: {
        userName: "", // 登录名
        cnName: "", // 用户姓名
        pwd: "", // 密码
        groupId: "",
        roleCode: "",
      },
      passwordType: "password", // 密码输入框类型
      submitRules: {
        userName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        cnName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
        ],
        pwd: [
          { required: true, validator: this.validatePass, trigger: "blur" },
        ],
        roleCode: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
      currentUser: null, // 当前登录用户
      roleData: [],
      roleDatas:[],
      groupData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  computed: {
    dlgTitle() {
      return this.userData.id ? "编辑信息" : "新增用户";
    },
  },
  created() {
    this.currentUser = JSON.parse(sessionStorage.getItem("userInfo"));
    if (this.userData.id) {
      // 判断编辑还是新增
      this.submitForm = {
        id: this.userData.id,
        userName: this.userData.user_name, // 登录名
        cnName: this.userData.cn_name, // 用户姓名
        pwd: this.userData.pwd, // 密码
        groupId: this.userData.groups[0] ? this.userData.groups[0].id : '', // 组
        roleCode: this.userData.role_code, // 角色
      };
    }
    this.getAllRoles();
    this.getAllGroups();
  },
  
  methods: {
    filterData(){
      if (this.submitForm.userName != 'admin'){
        this.roleDatas = this.roleData.filter(i=>{
          return i.role_code != '0'
        })
      }else {
        this.roleDatas = this.roleData
      }
    },
    async getAllRoles() {
      // 获取所有角色
      await api.user.getRolesByLevel({ level: this.currentUser.role_level }).then((res) => {
        this.roleData = res;
      });
    },
    validatePass: (rule, value, callback) => {
      // 密码校验
      const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{1,}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码必须为数字、字母及特殊字符组合！"));
      } else if (value.toString().length < 8 || value.toString().length > 30) {
        callback(new Error("密码长度应为8 ~ 30个字符！"));
      } else {
        callback();
      }
    },
    submit() {
      this.$refs["submitForm"].validate((valid) => {
        if (!this.submitForm.roleCode) {
          this.$message({
            type: "error",
            message: "请选择角色!",
          });
          return false;
        }
        if (!this.submitForm.groupId) {
          this.$message({
            type: "error",
            message: "请分配权限!",
          });
          return false;
        }
        if (valid) {
          this.$confirm("请确认是否提交！", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const _key = "sihuatech";
            this.submitForm.pwd = this.encryptByDES(this.submitForm.pwd, _key);
            this.userData.id
              ? this.editUser().then((i) => {
                  this.$emit("updateData");
                  this.close();
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                })
              : this.addUser().then((i) => {
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
    async addUser() {
      // 新增用户
      await api.user.addUser(this.submitForm);
    },
    async editUser() {
      // 修改用户信息
      let params = {
        id: this.submitForm.id,
        cnName: this.submitForm.cnName,
        roleCode: this.submitForm.roleCode,
        groupId: this.submitForm.groupId,
      };
      await api.user.editUser(params);
    },

    //DES加密 Pkcs7填充方式
    encryptByDES(message, key) {
      const keyHex = CryptoJS.enc.Utf8.parse(key);
      const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },

    close() {
      this.$emit("close", "editDlgShow");
    },
    getAllGroups() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      api.user.searchAllGroup({ groupId: userInfo.groupId }).then((res) => {
        this.groupData = res;
        for (let i = 0, len = res ? res.length : 0; i < len; i++) {
          let item = res[i];
          if (item.id === Number(userInfo.groupId)) {
            this.submitForm.groupId = item.id;
            break;
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.camera-box {
  width: 100%;

  .search-tree {
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
  }
}
</style>
