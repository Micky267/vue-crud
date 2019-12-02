<template>
  <div class="catalog-maintain-ope">
    <a-form :form="form">
      <a-form-item
        :label-col="formInputLayout.labelCol"
        :wrapper-col="formInputLayout.wrapperCol"
        label="主编目录编号"
      >
        <a-input
          v-decorator="[
          'catalogNo',
          { rules: [{ required: true, message: '此项不能为空' }] },
        ]"
          placeholder="请输入"
        />
      </a-form-item>

      <a-form-item
        :label-col="formInputLayout.labelCol"
        :wrapper-col="formInputLayout.wrapperCol"
        label="主编目录名称"
      >
        <a-input
          v-decorator="[
          'catalogName',
          { rules: [{ required: true, message: '此项不能为空' }] },
        ]"
          placeholder="请输入"
        />
      </a-form-item>

      <a-form-item
        :label-col="formInputLayout.labelCol"
        :wrapper-col="formInputLayout.wrapperCol"
        label="所属父类"
      >
        {{detailsData.parentCatalogName?detailsData.parentCatalogName:''}}
        <a-button type="primary" ghost>选择</a-button>
      </a-form-item>
    </a-form>

    <div class="operation">
      <a-button type="default" @click="onGoback">返回</a-button>
      <a-button type="primary" @click="onAddData" :loading="loading">{{operationBt}}</a-button>
    </div>
  </div>
</template>

<script>
import MsgBus from "../components/msgBus.js";
export default {
  name: "catalog-maintain-ope",
  data() {
    return {
      form: this.$form.createForm(this, { name: "ope_data_rule" }),
      formInputLayout,
      loading: false,
      operationBt: "添加",
      detailsData
    };
  },

  created() {
    if (this.$route.query.operation == "update") {
      this.operationBt = "修改";
    }
  },

  mounted() {
    //更改表单数据
    if (this.$route.query.operation == "update") {
      this.form.setFieldsValue({
        catalogName: this.detailsData.catalogName,
        catalogNo: this.detailsData.catalogNo
      });
    }
  },

  methods: {
    //点击添加数据
    onAddData() {
      this.form.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          this.loading = true;
          //发送请求
          this.reqDatas(values);
        }
      });
    },

    //点击返回按钮
    onGoback() {
      //数据重置
      detailsData = {};
      this.$router.push("/catalog-maintain");
    },

    //发送请求
    reqDatas(values) {
      console.log("detailsData", this.detailsData);
      const url = "/api/subjectCatalog/save";
      const params = {
        id: this.detailsData.id,
        catalogName: values.catalogName,
        catalogNo: values.catalogNo,
        createMan: "Micky",
        parentCatalogName: "非税系统",
        pid: "340d4b30a4d845498f3410eff2cd5917"
      };
      this.axios
        .post(url, params)
        .then(res => {
          this.loading = false;
          if (res.data.is_success) {
            this.$message.success("添加或修改成功!");

            //数据重置
            detailsData = {};
            //返回到主界面
            this.onGoback();
          } else {
            this.$message.error("失败!" + res.data.body);
          }
        })
        .catch(res => {
          console.log("错误", res);
        });
    }
  }
};

const formInputLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
};

let detailsData = {};

//监听广播
//先写一个全局的detailsData变量存储接收到广播的值
//将vue实例里data的detailsData的值设置为该变量
MsgBus.$on("details", e => {
  detailsData = e;
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.catalog-maintain-ope {
  width: 100%;
  height: 500px;
  background-color: #fff;
  margin-top: 16px;
  padding-top: 24px;
}
.operation {
  float: right;
  margin-right: 100px;
}

.operation button {
  margin-top: 20px;
  margin-right: 10px;
}
</style>
