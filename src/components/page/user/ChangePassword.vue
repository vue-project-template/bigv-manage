<template>
  <div>
    <el-form class="submit-form" :model="submitForm" :rules="submitRules" ref="submitForm">
      <el-form-item label="用户姓名" label-width="100px">
        <el-input size="small" v-model="submitForm.cnName" disabled auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录名" label-width="100px">
        <el-input size="small" v-model="submitForm.userName" disabled auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="当前密码" prop="curPassword" label-width="100px">
        <el-input size="small" :type="passwordType" v-model="submitForm.curPassword" auto-complete="new-password" >
          <i slot="suffix" class="el-input__icon el-icon-view" @click="passwordType = passwordType ? '' : 'password'"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" label-width="100px">
        <el-input size="small" :type="passwordType2" v-model="submitForm.newPassword" auto-complete="new-password">
          <i slot="suffix" class="el-input__icon el-icon-view" @click="passwordType2 = passwordType2 ? '' : 'password'"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="okPassword" label-width="100px">
        <el-input size="small" :type="passwordType3" v-model="submitForm.okPassword" auto-complete="new-password">
          <i slot="suffix" class="el-input__icon el-icon-view" @click="passwordType3 = passwordType3 ? '' : 'password'"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import $lodash from 'lodash'
import bus from '../../../components/common/js/bus'
import api from "@/api/common.api.js"
import CryptoJS from 'crypto-js'
export default {
  data() {
    return {
      submitForm: {
        id: '', // 用户id
        userName: '', // 登录名
        cnName: '', // 用户姓名
        curPassword: '', // 当前密码
        newPassword: '', // 新密码
        okPassword: '', // 确认密码
        serveBackPwd: '', // 暂存密码
      },
      
      passwordType: 'password', // 密码输入框类型
      passwordType2: 'password', // 密码输入框类型
      passwordType3: 'password', // 密码输入框类型
      submitRules: {
        // userName: [
        //   { required: true, message: '请输入登录名', trigger: 'blur' }
        // ],
        // cnName: [
        //   { required: true, message: '请输入用户姓名', trigger: 'blur' }
        // ],
        curPassword: [
          { required: true, validator: this.validateCurPass, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, validator: this.validateNewPass, trigger: 'blur' },
        ],
        okPassword: [
          { required: true, validator: this.validateOkPass, trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.submitForm.userId = userInfo.id
    this.submitForm.cnName = userInfo.cn_name
    this.submitForm.userName = userInfo.user_name
    this.getUserInfoById({id: userInfo.id})
  },
  methods: {
    async getUserInfoById(params) { // 根据id查询用户
      await api.user.getUserById(params).then(res => {
        let that = this
        that.submitForm.serveBackPwd = res.pwd
      })
    },

    validateCurPass(rule, value, callback) { // 当前密码校验
      const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{1,}$/
      console.log(this.submitForm);
      const _key = 'sihuatech';
      value = this.encryptByDES(value, _key);
      if (value === "") {
        callback(new Error("请输入当前密码"))
      } else if (!reg.test(value)) {
        callback(new Error("密码必须为数字、字母及特殊字符组合！"))
      } else if (value.toString().length < 8 || value.toString().length > 30) {
        callback(new Error("密码长度应为8 ~ 30个字符！"))
      } else if (this.submitForm.serveBackPwd != value) {
        callback(new Error("当前密码输入错误！"))
      } else {
        callback();
      }
    },
    validateNewPass: (rule, value, callback) => { // 新密码校验
      const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{1,}$/
      if (value === "") {
        callback(new Error("请输入新密码"))
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
      } else if (this.submitForm.newPassword != value) {
        callback(new Error("两次输入的密码不一致！"))
      } else {
        callback();
      }
    },
    submit() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          this.$confirm('请确认是否修改密码！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changePwd();
            this.close();
            this.$message({
              type: 'success',
              message: '修改成功!'
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
        userName: this.submitForm.userName,
        pwd: this.encryptByDES(this.submitForm.okPassword, _key),
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
      bus.$emit('close_current_tags')
    }
  }
}
</script>

<style scoped>
  .submit-form,.dialog-footer{
    width: 360px;
    margin: 20px auto 0;
  }
  .dialog-footer{
    text-align: center;
  }
</style>