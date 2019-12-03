<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh" theme="light">
    <a-layout-header theme="dark" :style="{color:'#fff'}">后台管理系统</a-layout-header>
    <a-layout>
      <a-layout-sider collapsible v-model="collapsed">
        <a-menu
          theme="dark"
          :defaultSelectedKeys="['3']"
          mode="inline"
          @click="onMenu"
          :openKeys="openKeys"
          @openChange="onOpenChange"
        >
          <a-menu-item key="1" @click="onBase()">常用基础数据管理</a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <span>基础数据其它管理功能</span>
            </span>
            <a-menu-item key="2" @click="onRecode()">代码重用设置</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <span>主题库管理</span>
            </span>
            <a-menu-item key="3" @click="onCatalogMaintain()">主题目录维护</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-content style="margin: 0 16px">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      collapsed: false,
      rootSubmenuKeys: ["sub1", "sub2"],
      openKeys: ["sub2"]
    };
  },
  methods: {
    onRecode() {
      this.$router.push("/recode");
    },
    onBase() {
      this.$router.push("/data-common");
    },
    onCatalogMaintain() {
      this.$router.push("/catalog-maintain");
    },
    onMenu(e) {
      console.log("显示菜单信息：", e);
    },
    //切换菜单
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
};
</script>

<style>
</style>
