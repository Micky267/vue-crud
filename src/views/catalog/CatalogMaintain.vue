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

    <Test />
    <Test2 />
  </div>
</template>

<script>
import MsgBus from "../../components/msgBus.js";
import Test from "../../views/test.vue";
import Test2 from "../../views/test2.vue";
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
              this.getTreeDatas(this.resDatas); //将请求到的数据添加key和title，这样数目录才可以识别
              this.defaultSelectedKeys[0] = res.data.body[0].id; //设置默认选中的树节点
              resolve(res.data.body[0].id);
              console.log("过滤后的目录数据", this.resDatas);
            }
          })
          .catch(res => {
            console.log(res);
          });
      });
    },

    //发送请求，获取指定目录的详情
    reqTheDataDetails(id) {
      const url = "/api/subjectCatalog/findOne/" + id;
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
        MsgBus.$emit("gdata", this.resDatas);
        this.$router.push({
          path: "/catalog-maintain/operation",
          query: { operation: "add" }
        });
        return;
      }

      if (ope == "update") {
        if (this.ifSelect) {
          MsgBus.$emit("details", this.details, this.resDatas);
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
      if (Array.isArray(arrDatas))
        arrDatas.forEach(value => {
          //为节点增加属性
          value.key = value.id;
          value.title = value.catalogName;
          value.scopedSlot = { title: "title" };
          //如果属性children不为空
          if (value.children) {
            this.getTreeDatas(value.children);
          }
        });
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

    // tree(resDatas) {
    //   //先判断是不是数组
    //   if (Array.isArray(resDatas)) {
    //     resDatas.forEach((item, index) => {

    //       //为节点增加属性
    //       item.title = item.catalogName;
    //       item.key = item.id;

    //       //判断这个节点的children属性是否不为空
    //       if (!item.children) {
    //         this.tree(item.children);
    //       }
    //     });
    //   }
    //   //如果是数组的话，就开始遍历每一项

    //   //如果这一项有children这个属性的话

    //   //调用本身这个函数 参数传的是 children
    // },

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
  },

  components: {
    Test,
    Test2
  }
};
let i = 1;
let resDatasCache = [];
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
