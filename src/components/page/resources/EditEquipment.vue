<template>
  <div>
    <el-dialog :title="dlgTitle" :visible="true" width="46%" :before-close="close" :close-on-click-modal="false">
      <el-form class="submit-form" :model="submitForm" :rules="submitRules" ref="submitForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域名称" label-width="100px">
              <el-select size="small" v-model="searchForm.areaId" filterable @change="getSubareaData" :disabled="readOnly" placeholder="请选择区域">
                <el-option
                  v-for="item in areaData"
                  :key="item.area_id"
                  :label="item.area_name"
                  :value="item.area_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子区域名称" label-width="100px">
              <el-select size="small" v-model="searchForm.subareaId" filterable @change="getSiteData" :disabled="readOnly" placeholder="请选择子区域">
                <el-option
                  v-for="item in subAreaData"
                  :key="item.subarea_id"
                  :label="item.subarea_name"
                  :value="item.subarea_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="站点名称" label-width="100px">
              <el-select size="small" v-model="searchForm.siteId" filterable @change="getRoomData" :disabled="readOnly" placeholder="请选择站点">
                <el-option
                  v-for="item in siteData"
                  :key="item.site_id"
                  :label="item.site_name"
                  :value="item.site_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在机房" prop="roomId" label-width="100px">
              <el-select size="small" v-model="submitForm.roomId" filterable @change="getFrameData" :disabled="readOnly" placeholder="请选择机房名称">
                <el-option
                  v-for="item in roomData"
                  :key="item.room_id"
                  :label="item.room_name"
                  :value="item.room_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="对应机架" prop="frameId" label-width="100px">
              <el-select size="small" v-model="submitForm.frameId" filterable :disabled="readOnly" placeholder="请选择机架名称">
                <el-option
                  v-for="item in frameData"
                  :key="item.frame_id"
                  :label="item.frame_name"
                  :value="item.frame_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceType" :disabled="readOnly" placeholder="请输入设备类型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码" prop="deviceCode" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceCode" :disabled="readOnly" placeholder="请输入设备编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceName" :disabled="readOnly" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="集团名称" prop="deviceGroupName" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceGroupName" :disabled="readOnly" placeholder="请输入集团名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备厂家" prop="deviceCompany" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceCompany" :disabled="readOnly" placeholder="请输入设备厂家"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="deviceModel" label-width="100px">
              <el-input size="small" v-model="submitForm.deviceModel" :disabled="readOnly" placeholder="请输入设备型号"></el-input>
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
import $lodash from 'lodash'
import api from "@/api/common.api.js"
export default {
  props: {
    eqData: { // 传入用户信息
      type: Object,
    }
  },
  data() {
    return {
      searchForm: {
        groupId: '',
        userName: '',
        areaId: '',
        subareaId: '',
        siteId: ''
      },
      submitForm: {
        roomId: '', // 所在机房
        frameId: '', // 对应机架
        deviceType: '', // 设备类型
        deviceCode: '', // 设备编码
        deviceName: '', // 设备名称
        deviceGroupName: '', // 集团名称
        deviceCompany: '', // 设备厂家
        deviceModel: '', // 设备型号
      },
      submitRules: {
        roomId: [
          { required: true, message: '请选择机房', trigger: 'change' }
        ],
        frameId: [
          { required: true, message: '请选择机架', trigger: 'change' }
        ],
        deviceType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        deviceCode: [
          { required: true, message: '请输入设备编码', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceGroupName: [
          { required: true, message: '请输入集团名称', trigger: 'blur' }
        ],
        deviceCompany: [
          { required: true, message: '请输入设备厂家', trigger: 'blur' }
        ],
        deviceModel: [
          { required: true, message: '请输入设备型号', trigger: 'blur' }
        ],
      },
      groupId: '',
      userName: '',
      areaData: [], // 区域数据 
      subAreaData: [], // 子区域数据
      siteData: [], // 站点信息数据
      roomData: [], // 机房下拉数据
      frameData: [], // 机架下拉数据
    }
  },
  computed: {
    dlgTitle() {
      let title = ''
      if(this.eqData.id) {
        if(this.eqData.readOnly) {
          title = '查看设备'
        }else{
          title = '编辑设备'
        }
      } else {
        title = '新增设备'
      }
      return title
    },
    readOnly() {
      return this.eqData.readOnly ? true : false
    }
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.searchForm.groupId = userInfo.groupId
    this.searchForm.userName = userInfo.user_name
    if(this.eqData.id){ // 判断编辑还是新增
      this.getAreaData()
      this.getSubareaData(this.eqData.area_id)
      this.getSiteData(this.eqData.subarea_id)
      this.getRoomData(this.eqData.site_id)
      this.getFrameData(this.eqData.room_id)
      this.searchForm.areaId = this.eqData.area_id,
      this.searchForm.subareaId = this.eqData.subarea_id,
      this.searchForm.siteId = this.eqData.site_id
      this.submitForm = {
        roomId: this.eqData.room_id, // 所在机房
        frameId: this.eqData.frame_id, // 对应机架
        deviceType: this.eqData.device_type, // 设备类型
        deviceCode: this.eqData.device_code, // 设备编码
        deviceName: this.eqData.device_name, // 设备名称
        deviceGroupName: this.eqData.device_group_name, // 集团名称
        deviceCompany: this.eqData.device_company, // 设备厂家
        deviceModel: this.eqData.device_model, // 设备型号
      }
    } else {
      this.getAreaData()
    }
  },
  methods: {
    async getAreaData() { // 获取区域数据
      let params={
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName
      }
      await api.resources.getAreaInfo(params).then(res => {
        let that = this;
        that.areaData = res
      })
    },
    async getSubareaData(val) { // 获取子区域数据
      this.searchForm.subareaId = ''
      let params={
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        areaId: val,
      }
      await api.resources.getSubareaInfo(params).then(res => {
        let that = this;
        that.subAreaData = res
      })
    },
    async getSiteData(val) { // 获取站点信息数据
      this.searchForm.siteId = ''
      let params={
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        subareaId: val,
      }
      await api.resources.getSiteInfo(params).then(res => {
        let that = this;
        that.siteData = res
      })
    },
    async getRoomData(val) { // 获取站点下机房信息数据
      this.submitForm.roomId = ''
      let params={
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        siteId: val,
      }
      await api.resources.getRoomInfo(params).then(res => {
        let that = this;
        that.roomData = res
      })
    },
    async getFrameData(val) { // 获取机架信息数据
      this.submitForm.frameId = ''
      let params={
        groupId: this.searchForm.groupId,
        userName: this.searchForm.userName,
        roomId: val,
      }
      await api.resources.getFrameInfo(params).then(res => {
        let that = this;
        that.frameData = res
      })
    },

    submit() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          this.$confirm('请确认是否提交！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.eqData.id ? 
            this.editDevice(this.submitForm).then(res => {
              this.$emit('updateData')
              this.close()
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
            }) : 
            this.addDevice(this.submitForm).then(res => {
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

    async addDevice(params) { // 新增设备
      await api.resources.addDevice(params)
    },
    async editDevice(params) { // 修改设备信息
      params.id = this.eqData.id
      await api.resources.editDevice(params)
    },

    close() {
      this.$emit('close', 'editDlgShow')
    }
  }
}
</script>
