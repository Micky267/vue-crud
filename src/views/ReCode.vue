<template>
  <div class="recode">
    <div class="select container">
      <a-row>
        <a-col :span="9">
          <div class="data-table-name select-data">
            <label>基础数据表名:</label>
            <a-input placeholder="请输入..." v-model="selTableName" />
          </div>
        </a-col>
        <a-col :span="9">
          <div class="data-name select-data">
            <label>基础数据名称:</label>
            <a-input placeholder="请输入..." v-model="selTableDesc" />
          </div>
        </a-col>
        <a-col :span="6">
          <div class="operation">
            <a-button type="primary" class="sel-bt" @click="onSelect">搜索</a-button>
            <a-button @click="sellectReset">重置</a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="show container">
      <div class="content">
        <div class="operation">
          <a-button type="primary" class="sel-bt" @click="addData">新增</a-button>
          <a-button type="primary" class="sel-bt">修改</a-button>
          <a-button type="primary" class="sel-bt" @click="deleteData">删除</a-button>
          <a-button type="primary" class="sel-bt">启用</a-button>
        </div>
        <a-table
          :columns="columns"
          :rowSelection="rowSelection"
          :dataSource="tableDatas"
          :pagination="pagination"
          @change="pageChange"
        />
      </div>
    </div>

    <RecodeModel :ifvisible="ifVisible" @add-model="addModel" />
  </div>
</template>

<script>
import RecodeModel from "../components/RecodeModel";
export default {
  name: "recode",
  components: {
    RecodeModel
  },
  data() {
    return {
      tableDatas: [],
      columns,
      selTableName: "", //基础数据表名
      selTableDesc: "", //基础数据描
      pagination: {
        showSizeChanger: true,
        total: 20, //设置获取到的数据总数
        defaultCurrent: 1
      },
      currentPage: 1, //当前页,
      pageSize: 10, //页面数据长度
      ModalText: "Content of the modal",
      confirmLoading: false,
      ifVisible: false, //显示对话框
      selectedRowKeysData: [] //存储选中数据的id数组
    };
  },

  computed: {
    //表格选中时调用的属性
    rowSelection: function() {
      return {
        selectedRowKeys: this.selectedRowKeysData,//设置当前选中的数据数组

        //当选中数据时，将所选数据赋值到全局变量的selectedRowKeysData中，以给其它数据调用
        onChange: selectedRowKeys => {
          this.selectedRowKeysData = selectedRowKeys;
          console.log("selectedRowKeys", selectedRowKeys);
        }
      };
    }
  },
  created() {
    
    this.getDatas();
  },
  methods: {

    //翻页 和 更改页面数据长度 触发
    pageChange: function(pagination) {
      this.currentPage = pagination.current;  //更新全局的当前页，方便
      console.log("this.currentPage", this.currentPage);
      this.pageSize = pagination.pageSize;
      this.getDatas();
    },

    //发送请求，获取数据
    getDatas: function() {
      const url = "/api/codeUseAgainConf/findForPageByConditions";
      const params = {
        tableName: this.selTableName,
        tableDesc: this.selTableDesc,
        page: this.currentPage,
        pageSize: this.pageSize
      };
      this.axios
        .get(url, { params })
        .then(res => {
          console.log("这是请求后台的数据", res);
          this.pagination.total = res.data.body.total;  //获取数据总量，以便分页显示
          getTabledatas(res.data.body.list);  //过滤，存储表格需要的数据
        })
        .catch(function(error) {
          // handle error
          console.log("这是错误信息", error);
        });
    },

    //查询
    onSelect: function() {
      this.currentPage = 1;
      this.getDatas();
    },

    //重置
    sellectReset: function() {
      //重置
      this.selTableName = "";
      this.selTableDesc = "";
      this.currentPage = 1;

      //更新表格
      this.getDatas();
    },

    // 添加数据,显示对话框
    addData: function() {
      this.ifVisible = true;
    },

    //添加数据里的监听对话框里面的确定或者返回键
    addModel: function(code) {
      if (code == 1) {
        this.getDatas();// 更新表格数据
      }
      this.ifVisible = false;
    },

    //获取所选到的数据的Key
    onSelectChange(selectedRowKeys) {
      console.log("选到的key: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },

    //删除数据
    deleteData: function() {
      // 先判断用户是否有选中数据，如果没有则提示，有的话弹出删除框
      if (this.selectedRowKeysData.length == 0) {
        this.$message.warning("请选择要删除的数据");
      } 
      else {
        this.$confirm({
          title: "删除",
          content: "是否删除所选项目",
          okText: "确认",
          cancelText: "取消",
          
          // 确定删除时，发送删除请求
          onOk: () => {
            console.log("要删除的是：" + this.selectedRowKeysData);
            this.deleteDataReq();
            console.log("OK");
          },

          //取消删除
          onCancel: () => {
            console.log("Cancel");
          }
        });
      }
    },

    //发送删除数据请求
    deleteDataReq: function() {
      const url = "/api/codeUseAgainConf/deleteInBatch";
      let params = {
        baseDataUseAgainConfIds: this.selectedRowKeysData.join(",")
      };
      this.axios
        .delete(url, { params })
        .then(res => {
          this.$message.success("删除成功！");
          //更新表格
          this.getDatas();
          //重置数据
          this.selectedRowKeysData = [];
          console.log("删除数据成功返回的数据", res);
        })
        .catch(function(error) {
          console.log("删除数据错误信息", error);
        });
    }
  }
};

const columns = [
  {
    title: "基础数据表名",
    dataIndex: "tableName"
  },
  {
    title: "基础数据名称",
    dataIndex: "tableDesc"
  },
  {
    title: "是否重用",
    dataIndex: "ifUseAgain"
  },
  {
    title: "说明",
    dataIndex: "remark"
  }
];

// 将请求到的数据过滤一下，存储表格需要的数据
function getTabledatas(resDatas) {
 this.tableDatas = resDatas.map(item => {
    let arr = {};
    arr.key = item.baseDataUseAgainConfId;
    arr.tableName = item.tableName;
    arr.tableDesc = item.tableDesc;
    arr.remark = item.remark;
    arr.key = item.baseDataUseAgainConfId;
    switch (item.ifUseAgain) {
      case "0":
        arr.ifUseAgain = "否";
        break;
      case "1":
        arr.ifUseAgain = "是";
        break;
      default:
        arr.ifUseAgain = "不确定";
    }
    return arr;
  });
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: relative;
  box-sizing: border-box;
  padding: 24px;
  background: #fff;
  margin: 10px 0;
}
.select .ant-row {
  position: relative;
}
.select .select-data {
  box-sizing: border-box;
  width: 100%;
}
.select label {
  box-sizing: border-box;
  width: 15%;
}
.select input {
  box-sizing: border-box;
  width: 80%;
  max-width: 200px;
  margin-left: 10px;
}
.select .operation {
  position: absolute;
  /* margin: auto; */
  top: 0;
  bottom: 0;
}
.select .operation .sel-bt {
  margin-right: 10px;
}

.show .content::before {
  content: "";
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
}
.show .operation {
  float: right;
  margin-bottom: 16px;
}

.show .ant-table-wrapper::before {
  content: "";
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
}

.show .operation button {
  margin-left: 5px;
}
</style>
