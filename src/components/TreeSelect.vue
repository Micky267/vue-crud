<template>
  <div>
    <a-modal
      title="选择父级"
      :visible="ifvisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
    >
      <div class="content">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <a-tree
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          :treeData="gData"
        >
          <template slot="title" slot-scope="{title}">
            <span v-if="title.indexOf(searchValue) > -1">
              {{title.substr(0, title.indexOf(searchValue))}}
              <span
                style="color: #f50"
              >{{searchValue}}</span>
              {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
            </span>
            <span v-else>{{title}}</span>
          </template>
        </a-tree>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    ifvisible: Boolean,
    gData: Array
  },
  data() {
    return {
      ModalText: "Content of the modal!!!",
      confirmLoading: false, //加载中的转圈圈
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true
    };
  },
  created() {},
  mounted() {
    generateList(this.gData);
    console.log("treeSelect界面的generateList(this.gData)", this.gData);
  },

  methods: {
    //点击弹出框确定键时
    handleOk(e) {
      this.$emit("sel-father-handle", 1);
    },

    //点击弹出框返回键时
    handleCancel(e) {
      this.$emit("sel-father-handle", 0);
    },

    //展开树目录
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },

    //搜索框发生改变时
    onChange(e) {
      console.log('datalist',dataList)
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, this.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    }
  }
};

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key:node.title, title: node.title });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
</script>
