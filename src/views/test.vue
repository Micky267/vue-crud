<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
    <a-tree
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="gData1"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color: #f50">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else>{{title}}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>

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
export default {
  data() {
    return {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      gData1: [
        {
          key: "1",
          title: "1",
          scopedSlots: {
            title: "title"
          },
          children: [
            {
              key: "哈哈",
              title: "哈哈",
              scopedSlots: {
                title: "title"
              }
            },
            {
              key: "一体化系统3",
              title: "一体化系统3",
              scopedSlots: {
                title: "title"
              }
            }
          ]
        },
        {
          key: "2",
          title: "一体化系统4",
          scopedSlots: {
            title: "title"
          },
          children: [
            {
              key: "21",
              title: "一体化系统5",
              scopedSlots: {
                title: "title"
              }
            },
            {
              key: "22",
              title: "一体化系统6",
              scopedSlots: {
                title: "title"
              }
            }
          ]
        }
      ],
    };
  },
  mounted() {
    // console.log('gData',gData)
    // console.log('gData1',this.gData1)
    // console.log("----------")
    // generateList(gData);
    generateList(this.gData1);
    console.log("dataList", dataList);
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, this.gData1);
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
</script>
