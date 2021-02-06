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
        <a-button type="primary" ghost>选择</a-button>
      </a-form-item>
    </a-form>

    <div class="operation">
      <a-button type="default" @click="onGoback">返回</a-button>
      <a-button type="primary" @click="onAddData" :loading="loading">{{operationBt}}</a-button>
    </div>
    {{test}}
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
      detailsData,
    };
  },

  created() {
    if (this.$route.query.operation == "update") {
      this.operationBt = "修改";
    }
  },

  mounted() {

    // this.$nextTick(function() {
    //   this.form.setFieldsValue({
    //     catalogName: this.test
    //   });
    // });
  console.log('detailsData',detailsData)

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
      this.$router.push("/catalog-maintain");
    },

    //发送请求
    reqDatas(values) {
      const url = "/api/subjectCatalog/save";
      const params = {
        catalogName: values.catalogName,
        catalogNo: values.catalogNo,
        createMan: "Micky",
        parentCatalogName: "非税系统",
        pid: "hjuhgyujhikjuhy"
      };
      this.axios
        .post(url, params)
        .then(res => {
          this.loading = false;
          if (res.data.is_success) {
            this.$message.success("添加成功!");
            //返回到主界面
            this.onGoback();
            console.log("添加信息成功", res);
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

 //当emit发送广播时，on会马上接收到信息，这时候该组件还未渲染完成，因此需要拿这个变量先做缓存
 //当组件渲染完成 再拿这个数据
let detailsData = null;  


MsgBus.$on("details", e => {
  console.log('触发到了MsgBus.$on')
  detailsData = e
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
