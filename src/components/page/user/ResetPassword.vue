<template>
  <div>
    <el-dialog title="重置密码" :visible="true" width="30%" :before-close="close" :close-on-click-modal="false">
      <el-form class="submit-form" :model="submitForm" :rules="submitRules" ref="submitForm">
        <el-row>
          <el-col :span="18">
            <el-form-item label="用户姓名" label-width="100px">
              <el-input size="small" v-model="userInfo.cn_name" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="新密码" prop="password" label-width="100px">
              <el-input size="small" :type="passwordType" v-model="submitForm.password" auto-complete="new-password">
                <i slot="suffix" class="el-input__icon el-icon-view" @click="passwordType = passwordType ? '' : 'password'"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="确认密码" prop="okPassword" label-width="100px">
              <el-input size="small" :type="passwordType2" v-model="submitForm.okPassword" auto-complete="new-password">
                <i slot="suffix" class="el-input__icon el-icon-view" @click="passwordType2 = passwordType2 ? '' : 'password'"></i>
              </el-input>
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
import $lodash from 'lodash'
import CryptoJS from 'crypto-js'
import api from "@/api/common.api.js"
export default {
  props: {
    userData: { // 传入用户信息
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userInfo: {}, // 用户信息拷贝
      submitForm: {
        password: '', // 新密码
        okPassword: '', // 确认密码
      },
      passwordType: 'password', // 密码输入框类型
      passwordType2: 'password', // 密码输入框类型
      submitRules: {
        password: [
          { required: true, validator: this.validatePass, trigger: 'blur' },
        ],
        okPassword: [
          { required: true, validator: this.validateOkPass, trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.userInfo = $lodash.cloneDeep(this.userData)
  },
  methods: {
    validatePass(rule, value, callback) { // 密码校验
      const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{1,}$/
      if (value === "") {
        callback(new Error("请输入密码！"))
      } else if (!reg.test(value)) {
        callback(new Error("密码必须为数字、字母及特殊字符组合！"))
      } else if (value.toString().length < 8 || value.toString().length > 30) {
        callback(new Error("密码长度应为8 ~ 30个字符！"))
      } else {
        callback();
      }
    },
    validateOkPass(rule, value, callback) { // 确认密码
      if (value === "") {
        callback(new Error("请输入确认密码！"))
      } else if (this.submitForm.password != value) {
        callback(new Error("两次输入的密码不一致！"))
      } else {
        callback();
      }
    },
    submit() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          this.userInfo.password = this.submitForm.password
          this.$confirm('请确认是否提交！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changePwd().then(res => {
              this.$emit('updateData')
              this.close()
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
            })
          })
        } else {
          return false;
        }
      });
    },
    async changePwd() { // 修改密码
      const _key = 'sihuatech';
      let params = {
        userName: this.userInfo.user_name,
        pwd: this.encryptByDES(this.submitForm.password, _key),
      }
      await api.user.changePwd(params)
    },

    //DES加密 Pkcs7填充方式
    encryptByDES(message, key){
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    close() {
      this.$emit('close', 'resetDlgShow')
    }
  }
}
</script>
