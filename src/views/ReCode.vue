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
          <a-modal
            title="Title"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
          >
            <p>{{ModalText}}</p>
          </a-modal>
          <a-button type="primary" class="sel-bt">修改</a-button>
          <a-button type="primary" class="sel-bt">删除</a-button>
          <a-button type="primary" class="sel-bt">启用</a-button>
        </div>
        <a-table
          :columns="columns"
          :dataSource="tabadatas"
          :rowSelection="rowSelection"
          :pagination="pagination"
          @change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "recode",
  data() {
    return {
      tabadatas: [],
      columns,
      rowSelection,
      selTableName: "", //基础数据表名
      selTableDesc: "", //基础数据名称
      pagination: {
        showSizeChanger: true,
        // onShowSizeChange: (current, pageSize) => {
        //   console.log("current", current);
        // },
        total: 20, //设置获取到的数据总数
        defaultCurrent: 1
      },
      currentPage: 1, //当前页,
      pageSize: 10, //页面数据长度
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false
    };
  },

  created() {
    this.getDatas();
  },
  methods: {
    //翻页 和 更改页面数据长度 触发
    pageChange: function(pagination) {
      this.currentPage = pagination.current;
      console.log("this.currentPage", this.currentPage);
      this.pageSize = pagination.pageSize;
      this.getDatas();
    },

    //发送请求，获取数据
    getDatas: function() {
      const url = "/api/codeUseAgainConf/findForPageByConditions";
      // var reqDatas = {
      //   tableName : this.selTableName,
      //   tableDesc : this.selTableDesc,
      //   page : this.currentPage,
      //   pageSize : this.pageSize
      // }

      // console.log(reqDatas,'reqDatas')
      // const options = {
      //   method: "get",
      //   // data: reqDatas,
      //   url
      // };
      // this.axios(options)
      // .then(res => {
      //     console.log("这是请求后台的数据", res);
      //     this.pagination.total = res.data.body.total;
      //     this.tabadatas = getTabledatas(res.data.body.list);
      //   })
      //   .catch(function(error) {
      //     // handle error
      //     console.log("这是错误信息", error);
      //   })

      this.axios
        .get(url, {
          params: {
            tableName: this.selTableName,
            tableDesc: this.selTableDesc,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          console.log("这是请求后台的数据", res);
          this.pagination.total = res.data.body.total;
          this.tabadatas = getTabledatas(res.data.body.list);
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
      this.selTableName = "";
      this.selTableDesc = "";
      this.currentPage = 1;
      this.getDatas();
    },

    // 添加数据,显示对话框
    addData: function() {
    console.log('按道理 ')
      this.visible = true;
    },

    //对话框点击确定
    handleOk(e) {
      this.ModalText = "The m odal will be closed after two seconds";
      this.confirmLoading = true; //开启延迟模式（转圈圈）
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },

    //对话框点击返回
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
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

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  }
};

function getTabledatas(resDatas) {
  let tabadatas = resDatas.map(item => {
    let arr = {};
    arr.key = item.baseDataUseAgainConfId;
    arr.tableName = item.tableName;
    arr.tableDesc = item.tableDesc;
    arr.remark = item.remark;
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
  return tabadatas;
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

/* .show .content {
  position: relative;
} */

.show .operation {
  float: right;
  margin-bottom: 16px;
  z-index: 999;
}

.show .operation button {
  margin-left: 5px;
}
</style>
