<template>
  <div>
    <a-modal
      title="新增"
      :visible="ifvisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
    >
      <div class="content">
        <a-form :form="form">
          <a-form-item
            :label-col="formInputLayout.labelCol"
            :wrapper-col="formInputLayout.wrapperCol"
            label="基础数据表名"
          >
            <a-input
              v-decorator="[
          'tableName',
          { rules: [{ required: true, message: '此项不能为空' }] },
        ]"
              placeholder="请输入"
            />
          </a-form-item>

          <a-form-item
            :label-col="formInputLayout.labelCol"
            :wrapper-col="formInputLayout.wrapperCol"
            label="基础数据描述"
          >
            <a-input
              v-decorator="[
          'tableDesc',
          { rules: [{ required: true, message: '此项不能为空' }] },
        ]"
              placeholder="请输入"
            />
          </a-form-item>

          <a-form-item
            :label-col="formRidoLayout.labelCol"
            :wrapper-col="formRidoLayout.wrapperCol"
            label="是否重用"
          >
            <a-radio-group
              v-decorator="['ifUseAgain',{
              rules:[{required: true}]
            }]"
            >
              <a-radio value="1">是</a-radio>
              <a-radio value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :label-col="formInputLayout.labelCol"
            :wrapper-col="formInputLayout.wrapperCol"
            label="备注"
          >
            <a-input v-decorator="['remark']" placeholder="请输入" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    ifvisible: Boolean
  },
  data() {
    return {
      ModalText: "Content of the modal!!!",
      confirmLoading: false, //加载中的转圈圈
      formInputLayout, //设置form的格式
      formRidoLayout,
      form: this.$form.createForm(this, { name: "add_data_rule" }), //创建form
      dataUpdatedBy: "Micky"
    };
  },
  computed: {
    dataUpdatedDate: function() {
      return formatTime();
    }
  },

  created() {
    //设置单选按钮的默认选项
    this.form.getFieldDecorator("ifUseAgain", {
      initialValue: "1"
    });
  },
  methods: {
    //点击弹出框确定键时
    handleOk(e) {
      this.form.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          //开始确定按钮的转动
          this.confirmLoading = true;
          this.addRequest(values);
        }
      });
    },

    //点击弹出框返回键时
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.$emit("add-model", 0);
      // this.ifvisible = false;
    },

    //发送添加字段的请求
    addRequest(values) {
      let params = {
        dataUpdatedBy: this.dataUpdatedBy,
        dataUpdatedDate: this.dataUpdatedDate,
        tableDesc: values.tableDesc,
        tableName: values.tableName,
        ifUseAgain: values.ifUseAgain,
        remark: values.remark ? values.remark : ""
      };
      console.log("params", params);

      const url = "/api/codeUseAgainConf/saveOrUpdate";
      this.axios
        .post(url, params)
        .then(res => {
          //停止确定按钮的转动
          this.confirmLoading = false;

          if (res.data.is_success) {
            //添加成功
            this.$message.success("添加成功!");

            //触发父组件，隐藏该弹窗,1为确定，0为返回，父组件更新数据
            this.$emit("add-model", 1);

            // 初始化表单值
            this.form.setFieldsValue({
              tableDesc: "",
              tableName: "",
              ifUseAgain: "1",
              remark: ""
            });
            console.log("添加成功！", res);
          }

          //添加失败
          else {
            this.$message.error("添加失败！" + res.data.body);
          }
        })
        .catch(function(error) {
          // handle error
          console.log("这是错误信息", error);
        });
    }
  }
};

//设置表单的长度
const formInputLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
};
const formRidoLayout = {
  labelCol: { span: 4, offset: 3 }
};

//日期元素的补零计算
function addZero(val) {
  if (val < 10) {
    return "0" + val;
  } else {
    return val;
  }
}

//获取当前格式好的时间
function formatTime() {
  const data = new Date();
  const year = data.getFullYear();
  const month = addZero(data.getMonth() + 1);
  const day = addZero(data.getDate());
  const hour = addZero(data.getHours());
  const minute = addZero(data.getMinutes());
  const second = addZero(data.getSeconds());
  const dataTime =
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  console.log("dataTime", dataTime);
  return dataTime; //将格式化后的字符串输出到前端显示
}
</script>
