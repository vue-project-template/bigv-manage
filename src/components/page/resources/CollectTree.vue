<template>
  <div>
    <div>添加摄像头：</div>
    <div class="Transfer-tree">
      <div class="content-left">
        <span class="tree-title">目录树</span>
        <div class="search-tree" v-if="collectTreeShow">
          <el-row>
            <el-input
              placeholder="搜索"
              size="mini"
              v-model="filterTreeText"
              @keyup.enter.native="filterTreeCollectTree"
              ><el-button
                slot="append"
                icon="el-icon-search"
                @click="filterTreeCollectTree"
              ></el-button
            ></el-input>
          </el-row>
          <elTree2
            class="filter-tree"
            :data="collectTreeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="code"
            nodeFilter="this.node.data.level === 4||this.node.data.level === 5"
            show-checkbox
            @node-click="handleLeftNode"
            ref="collectTree"
            v-loading="loadingTree"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            :emptyText="emptyText"
          >
          </elTree2>
        </div>
      </div>
      <div class="Transfer-tree-btn">
        <el-button
          size="mini"
          icon="el-icon-arrow-left"
          @click="enterLeft"
        ></el-button>
        <el-button
          size="mini"
          icon="el-icon-arrow-right"
          @click="backRight"
        ></el-button>
      </div>
      <div class="content-right">
        <span class="tree-title">资源池</span>
        <div class="search-tree">
          <el-row>
            <el-input
              placeholder="搜索"
              size="mini"
              v-model="filterTreeTextRes"
              @keyup.enter.native="filterTreeResTree"
              ><el-button
                slot="append"
                icon="el-icon-search"
                @click="filterTreeResTree"
              ></el-button
            ></el-input>
          </el-row>
          <elTree2
            class="filter-tree"
            :data="resTreeData"
            :props="resDefaultProps"
            :filter-node-method="filterNode"
            node-key="code"
            show-checkbox
            nodeFilter="this.node.data.isChecked === 1"
            ref="resTree"
            v-loading="loadingVpmTree"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            :emptyText="emptyTextVpm"
          >
          </elTree2>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      <el-button size="mini" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import api from "@/api/common.api.js";
import elTree2 from "@/components/common/tree/src/tree.vue";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
  components: {
    elTree2,
  },
  watch: {},
  data() {
    return {
      collectTreeShow: true,
      userId: "",
      filterTreeText: "", // 目录树筛选框文本
      collectTreeData: [], // 目录树数据
      collectEnterCode: "", // 目录树即将传入的机房code
      collectEnterNode: {}, // 目录树即将传入的机房node
      defaultProps: {
        children: "children",
        label: "name",
      },
      filterTreeTextRes: "", // 资源池筛选框文本
      resTreeData: [], // 资源池数据
      resDefaultProps: {
        children: "children",
        label: "name",
      },
      leftRoomChecked: [],
      linkRoom: [], // 关联机房数组
      unLinkRoom: [], // 取消关联数组
      loadingTree: false,
      loadingVpmTree: false,
      emptyText: "",
      emptyTextVpm: "",
    };
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.userId = userInfo.id;
    this.getResCameraTree();
    this.getVpmCameraTree();
  },
  methods: {
    filterTreeResTree() {
      if (this.filterTreeTextRes)
        this.$refs.resTree.filter(this.filterTreeTextRes);
      else this.resTreeData = JSON.parse(JSON.stringify(this.resTreeData));
    },
    filterTreeCollectTree() {
      if (this.filterTreeText)
        this.$refs.collectTree.filter(this.filterTreeText);
      else
        this.collectTreeData = JSON.parse(JSON.stringify(this.collectTreeData));
    },
    getVpmCameraTree() {
      this.loadingVpmTree = true;
      // 获取资源池摄像头树结构
      api.resources.getVpmCameraTree().then((res) => {
        this.resTreeData = res;
        this.loadingVpmTree = false;
        if (ArrayUtils.isEmpty(this.resTreeData)) {
          this.emptyTextVpm = "暂无数据";
        }
      });
    },
    getResCameraTree() {
      // 获取目录树摄像头树结构
      this.loadingTree = true;
      let params = {
        showAll: 0,
      };
      api.resources.getResCameraTree(params).then((res) => {
        this.collectTreeData = res;
        //目录树刷新不及时所及出次下策 刷新树
        this.collectTreeShow = false;
        this.$nextTick(() => (this.collectTreeShow = true));
        this.loadingTree = false;
        if (ArrayUtils.isEmpty(this.collectTreeData)) {
          this.emptyText = "暂无数据";
        }
      });
    },
    handleLeftNode(data) {
      // 点击左侧目录树节点
      if (data.code && data.level === 4) {
        let Keys = this.$refs.collectTree.getCheckedKeys();
        Keys.push(data.code);
        this.$refs.collectTree.setCheckedKeys(Keys);
      }
    },
    enterLeft() {
      // 移入左侧目录树
      let collectTree = this.$refs.collectTree.getCheckedNodes();
      let Keys = [];
      collectTree.forEach((item) => {
        item.level === 4 && Keys.push(item.code);
      });
      if (Keys.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择一个要传入的机房!",
        });
        return false;
      } else if (Keys.length > 1) {
        this.$message({
          type: "warning",
          message: "无法同时关联到多个机房，请重新选择一个关联机房！",
        });
        return false;
      }
      this.collectEnterCode = Keys[0];
      let curRightNodes = [];
      let curRightCodes = [];
      let nodes = this.$refs.resTree.getCheckedNodes();
      nodes.forEach((item) => {
        let collectTree = this.$refs.resTree.setChecked(item.code, false);
        if (item.isDevice === 1) {
          const parent = this.$refs.resTree.getNode(item).parent;
          item.level = 5;
          if (!item.device_parent_id) item.device_parent_id = item.parent_code;
          curRightNodes.push(item);
          curRightCodes.push(item.code);

          const children = parent.data.children || parent.data;
          const index = children.findIndex((d) => d.code === item.code);
          children.splice(index, 1);
        }
      });
      if (curRightNodes.length < 1) {
        this.$message({
          type: "warning",
          message: "请至少选择一个资源池的设备关联!",
        });

        return false;
      }
      //curRightNode = curRightNode[0]
      const data = this.$refs.collectTree.getNode(this.collectEnterCode).data;
      curRightNodes.forEach((curRightNode) => {
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(curRightNode);
      });
      let isHave = false;
      this.linkRoom.forEach((item) => {
        if (item.roomId === this.collectEnterCode) {
          item.deviceCodes = item.deviceCodes.concat(curRightCodes);
          isHave = true;
        }
      });
      if (!isHave) {
        let children = [];
        data.children.forEach((item) => {
          children.push(item.code);
        });
        let room = {};
        room.roomId = this.collectEnterCode;
        room.deviceCodes = children;
        this.linkRoom.push(room);
      }
      setTimeout(() => {
        this.$refs.collectTree.setCheckedKeys([this.collectEnterCode]);
        this.collectEnterCode = "";
      }, 100);
    },
    backRight() {
      // 回归右侧资源池
      let nodes = this.$refs.collectTree.getCheckedNodes();
      let curLeftNodes = [];
      nodes.forEach((item) => {
        this.$refs.collectTree.setChecked(item.code, false);
        if (item.level === 6) {
          item.code = "channel-" + item.code;
        }
        if (item.level === 5) {
          let parent = this.$refs.collectTree.getNode(item).parent;
          item.isDevice = 1;
          item.isChecked = 1;

          curLeftNodes.push(item);
          if (parent.data.level === 5) {
            parent = parent.parent;
          }
          let children = parent.data.children || parent.data;
          const index = children.findIndex((d) => d.code === item.code);
          children.splice(index, 1);
          let curRightCodes = [];
          children.forEach((item) => {
            curRightCodes.push(item.code);
          });
          let isHave = false;
          this.linkRoom.forEach((i) => {
            if (i.roomId === parent.data.code) {
              i.deviceCodes = curRightCodes;
              isHave = true;
            }
          });
          if (!isHave) {
            let room = {};
            room.roomId = parent.data.code;
            room.deviceCodes = curRightCodes;
            this.linkRoom.push(room);
          }
        }
      });
      if (curLeftNodes.length < 1) {
        this.$message({
          type: "warning",
          message: "请至少选择一个目录树设备取消关联!",
        });
        return false;
      }

      curLeftNodes.forEach((curRightNode) => {
        let data = this.$refs.resTree.getNode(curRightNode.device_parent_id)
          .data;
        let codes = [];
        this.treeAllExpanded(
          this.$refs.resTree.getNode(curRightNode.device_parent_id),
          codes
        );
        for (let i = codes.length; i > 0; i--) {
          this.$refs.resTree.store.nodesMap[codes[i - 1]].expanded = true;
        }
        setTimeout(() => {
          if (!data.children) {
            this.$set(data, "children", []);
          }
          data.children.push(curRightNode);
        }, 200);
      });
      // this.linkRoom.forEach(item=>{
      //   if(item.roomId===this.collectEnterCode){
      //     item.deviceCodes=item.deviceCodes.concat(curLeftNodes)
      //     isHave=true;
      //   }
      // });
      //this.findResRoomType(this.resTreeData, curLeftNode.room_code, 1)// 取消关联后设置资源池选中机房type为1
      // this.deleteNodeChild(this.collectTreeData, curLeftNode.code)
      //this.$set(curLeftNode, 'children', []) // 取消关联后删除左侧目录树选中机房子节点
      // let isNewUnLink = this.linkRoom.findIndex(i => {
      //   return i.roomId === curLeftNode.code && i.roomCode === curLeftNode.room_code
      // })
      // if(isNewUnLink < 0) { // 判断是否push到unLinkRoom，点击确定后请求接口取关
      //   this.unLinkRoom.push({
      //     roomId: curLeftNode.code,
      //     roomCode: curLeftNode.room_code
      //   })
      // } else {
      //   this.linkRoom.splice(isNewUnLink, 1)
      // }
      // this.$refs.collectTree.setChecked(curLeftNode.code, false, false)
    },
    //全部展开
    treeAllExpanded(node, codes) {
      if (node.data.code) codes.push(node.data.code);
      if (node.parent) {
        this.treeAllExpanded(node.parent, codes);
      }
    },
    findResRoomType(treeData, code, isChecked) {
      // 递归树改变资源池机房type
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].code === code) {
          treeData[i].isChecked = isChecked;
          return false;
        } else {
          treeData[i].children &&
            this.findResRoomType(treeData[i].children, code, type);
        }
      }
    },
    // deleteNodeChild(treeData, code) { // 递归树删除子节点
    //   for(let i = 0; i < treeData.length; i++) {
    //     if(treeData[i].code === code){
    //       treeData[i].children = []
    //       return false
    //     } else {
    //       treeData[i].children && this.deleteNodeChild(treeData[i].children, code)
    //     }
    //   }
    // },

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

    // async unassociationRoom(params) {
    //   // 请求接口取消关联
    //   await api.resources.unassociationRoom(params).then((res) => {});
    // },
    associationRoom(params) {
      // 请求接口关联机房
      api.resources.associationRoom(params).then((res) => {
        this.collectTreeData = this.resTreeData = null;
        this.getResCameraTree();
        this.getVpmCameraTree();
      });
    },
    submitServer() {
      this.associationRoom(this.linkRoom);
      this.unLinkRoom = [];
      this.linkRoom = [];
    },

    submit() {
      if (this.unLinkRoom.length < 1 && this.linkRoom.length < 1) {
        this.$message({
          type: "warning",
          message: "没有可提交的更改!",
        });
        return false;
      }
      this.$confirm("是否提交机房关联修改！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.submitServer();
        this.$message({
          type: "success",
          message: "提交成功!",
        });
      });
    },
    cancel() {
      if (this.unLinkRoom.length < 1 && this.linkRoom.length < 1) {
        this.$message({
          type: "warning",
          message: "没有可取消的更改!",
        });
        return false;
      }
      this.$confirm("是否取消机房关联修改！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.collectEnterCode = "";
        this.unLinkRoom = [];
        this.linkRoom = [];
        this.getResCameraTree();
        this.getVpmCameraTree();
        this.$message({
          type: "success",
          message: "取消成功!",
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.Transfer-tree {
  display: flex;
  justify-content: flex-start;
  height: 80%;
  min-height: 500px;
  margin-top: 20px;
  .content-left,
  .content-right {
    display: flex;
    justify-content: center;
    .tree-title {
      margin-right: 10px;
    }
    .search-tree {
      width: 380px;
      height: 100%;
      padding: 10px;
      overflow-y: auto;
      border: 1px solid #ebeef5;
      box-sizing: border-box;
    }
  }
  .Transfer-tree-btn {
    height: 50px;
    margin-left: 50px;
    position: relative;
    top: 50%;
  }
}
.footer-btn {
  margin-top: 30px;
  // text-align: center;
}
.filter-tree/deep/.is-current {
  background-color: #f5f7fa;
}
</style>
