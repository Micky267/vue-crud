<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh" theme="light">
    <a-layout-header theme="dark" :style="{color:'#fff'}">这是头部</a-layout-header>
    <a-layout>
      <a-layout-sider collapsible v-model="collapsed">
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
          <a-menu-item key="1" @click="onBase()">
            常用基础数据管理
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="user" />
              <span>User</span>
            </span>
            <a-menu-item key="2" @click="onRecode()">
              代码重用设置
              </a-menu-item>
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
  name: 'home',
  data() {
    return {
      collapsed: false
    };
  },
  methods:{
    onRecode(){
      this.$router.push('/recode')
    },
    onBase(){
      this.$router.push('/data-common')
    }
  }
};
</script>

<style>

</style>
