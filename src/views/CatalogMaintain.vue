<template>
  <div class="catalog-maintain">
    <a-layout>
      <a-layout-sider style="background-color: #fff">
        <a-tree @select="onSelect" :treeData="treeData" />
      </a-layout-sider>
      <a-layout-content>
        <div class="operation">
          <a-button type="primary" class="sel-bt" @click="onOperation('add')">新增</a-button>
          <a-button type="primary" class="sel-bt" @click="onOperation('update')">修改</a-button>
          <a-button type="primary" class="sel-bt">删除</a-button>
        </div>
        <div class="details">
          <div class="title">
            <h2>主题目录</h2>
          </div>

          <a-row>
            <a-col :span="12">主题目录编号：{{details.catalogNo}}</a-col>
            <a-col :span="12">主题目录名称：{{details.catalogName}}</a-col>
          </a-row>
          <a-row>
            <a-col :span="12">所属父类：{{details.parentCatalogName}}</a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import MsgBus from '../components/msgBus.js';
export default {
  name: "catalog-maintain",
  data() {
    return {
      treeData:[],   //树目录的数据
      details: {},   //目录对应的详情数据
    };
  },
  created() {
    this.init();
  },
  methods: {

    //发送请求，拿到目录的所有数据
    reqAllDatas() {
      const url = "/api/subjectCatalog/findAll";
      return new Promise((resolve, reject) => {
        this.axios
          .get(url)
          .then(res => {
            if (res.data.is_success) {
              this.getTreeDatas(res.data.body); //过滤成树结构需要的数据
              resolve(res.data.body[0].id);
            }
          })
          .catch(res => {
            console.log(res);
          });
      });
    },

    //发送请求，获取指定目录的详情
    reqTheDataDetails(id) {
      const url = "/api//subjectCatalog/findOne/" + id;
      this.axios
        .get(url)
        .then(res => {
          if (res.data.is_success) {
            this.details = res.data.body; //将详情赋值给全局变量
            console.log("获取指定目录信息的详情数据", res);
          }
        })
        .catch(res => {
          console.log("错误信息", res);
        });
    },

    //页面初始化
    init() {
      this.reqAllDatas().then(value => {
        this.reqTheDataDetails(value);
      });
    },

    //跳转到操作界面
    onOperation(ope) {
      if (ope == "add") {
        this.$router.push({
          path: "/catalog-maintain/operation",
          query: { operation: "add" }
        });
        return;
      }

      if (ope == "update") {
        MsgBus.$emit('details',this.details)
        this.$router.push({
          path: "/catalog-maintain/operation",
          query: { operation: "update" }
        });
      }
    },

    //将数据过滤成树形结构需要的数据
    getTreeDatas(resDatas) {
      let jsonDatas =  JSON.stringify(resDatas)+''
      let reId = jsonDatas.replace(/id/g,"key")
      let reTitle = reId.replace(/catalogName/g,"title")
      this.treeData = JSON.parse(reTitle)
    },


    //获取点击到的key
    onSelect(selectedKeys) {
      this.reqTheDataDetails(selectedKeys);
    }
  }
};


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.catalog-maintain {
  padding: 24px;
  width: 100%;
}

.catalog-maintain .ant-layout-sider {
  height: 400px;
  padding: 16px;
  margin-right: 24px;
}
.catalog-maintain .ant-layout-content {
  height: 400px;
  padding: 16px;
  background-color: #fff;
}

.ant-layout-content .operation {
  float: right;
  margin-bottom: 16px;
}

.ant-layout-content .operation button {
  margin-right: 5px;
}
.ant-layout-content .details {
  font-size: 16px;
  width: 100%;
}
.ant-layout-content .details::before {
  content: "";
  display: block;
  visibility: hidden;
  height: 0;
  clear: both;
}

.ant-layout-content .details .title {
  width: 100%;
  text-align: center;
}

.ant-layout-content .details .ant-row {
  margin-bottom: 10px;
}
</style>
