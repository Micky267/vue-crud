<template>
  <div class="catalog-maintain">
    <a-layout>
      <a-layout-sider style="background-color: #fff;min-width:250px">
        <a-tree @select="onSelect" :treeData="resDatas" :defaultSelectedKeys="defaultSelectedKeys" />
      </a-layout-sider>
      <a-layout-content>
        <div class="operation">
          <a-button type="primary" class="sel-bt" @click="onOperation('add')">新增</a-button>
          <a-button type="primary" class="sel-bt" @click="onOperation('update')">修改</a-button>
          <a-button type="primary" class="sel-bt" @click="onDelete">删除</a-button>
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
            <a-col :span="12">所属父类：{{details.parentCatalogName?details.parentCatalogName:'无'}}</a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import MsgBus from "../components/msgBus.js";
export default {
  name: "catalog-maintain",
  data() {
    return {
      resDatas: [], //请求到的目录数据
      details: {}, //目录对应的详情数据
      defaultSelectedKeys: [], //默认选中的树节点
      ifSelect: true //当前是否有树节点被选中
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
              this.resDatas = res.data.body;
              this.getTreeDatas(); //将请求到的数据添加key和title，这样数目录才可以识别
              this.resDatas = resDatasBus;
              this.defaultSelectedKeys[0] = res.data.body[0].id; //设置默认选中的树节点
              resolve(res.data.body[0].id);

              console.log("目录数据", res.data.body);
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
        if (this.ifSelect) {
          MsgBus.$emit("details", this.details);
          this.$router.push({
            path: "/catalog-maintain/operation",
            query: { operation: "update" }
          });
        } else {
          this.$message.warning("请选择操作对象");
        }
      }
    },

    //将数据过滤成树形结构需要的数据
    getTreeDatas(arrDatas) {
      let arr = arrDatas ? arrDatas : this.resDatas; //如果是第一次使用该函数，则是data里的数据，如果不是，则是递归时传入的数据
      arr.forEach(value => {
        if (Array.isArray(value.children)) {
          this.getTreeDatas(value.children);
        }
        value.key = value.id;
        value.title = value.catalogName;
      });
      resDatasCache = arr;  //由于是递归，会多次赋值操作，如果直接将数据赋值给数目录，则数目录会多次刷新，影响性能，所以先用一个值缓存下来，最后再将该值赋给数目录就好
    },

    //获取点击到的key
    onSelect(selectedKeys, e) {
      if (e.selected) {
        this.reqTheDataDetails(selectedKeys);
        console.log("点击选项时显示selectedKeys", selectedKeys);
        console.log("点击选项时显示e", e);
      } else {
        this.details = {}; //当前就没有详情数据
      }
      this.ifSelect = e.selected;
    },

    //删除操作
    onDelete() {
      if (this.ifSelect) {
        this.$confirm({
          title: "删除",
          content: "确定删除所选项？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            this.reqDelete();
          }
        });
      } else {
        this.$message.warning("请选择操作对象 ");
      }
    },

    //发送删除请求
    reqDelete() {
      const url = "/api/subjectCatalog/delete/" + this.details.id;
      this.axios
        .delete(url)
        .then(res => {
          this.$message.success("删除成功！");
          //更新表格
          this.init();
          //重置数据
          console.log("删除数据成功返回的数据", res);
        })
        .catch(function(error) {
          console.log("删除数据错误信息", error);
        });
    }
  }
};
let i = 1;
let resDatasBus = [];
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
