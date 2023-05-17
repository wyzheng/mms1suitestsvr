<template>
  <a-layout  id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider
      collapsible
      v-model="collapsed"
    >
      <a-row>
        <a-col span="24" align="center">
          <p style="padding: 5px">
            <font v-if="collapsed" style="font-family:verdana" color="white" size="3">s1s test</font>
            <font v-else style="font-family:verdana" color="white" size="6">s1s test</font>
          </p>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="24" align="center">
          <a-avatar size="large" :src="loginUserAvatar" align="center" />
        </a-col>
        <a-col span="24" align="center">
          <h5 v-if="collapsed" style="color: white">{{loginUserEngName}}</h5>
          <h5 v-else style="color: white">{{loginUserEngName}}({{loginUserChnName}})</h5>
        </a-col>
      </a-row>
      <a-menu theme="dark"
              :defaultSelectedKeys="!collapsed ? selectedKey.key : ''"
              :defaultOpenKeys="!collapsed ? selectedKey.box : ''"
              mode="inline"
              style="padding-top: 20px">
        <a-menu-item key="1">
          <router-link to="/testCases">
            <a-icon type="dashboard" />
            <span>用例管理</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu
          key="2"
        >
          <span slot="title">
            <router-link to="/testTask" style="color: white">
            <a-icon type="file" />
            <span >测试结果展示</span>
          </router-link>
          </span>
          <a-menu-item key="ui_test"><router-link to="/res/uiTestResult">UI测试结果</router-link></a-menu-item>
          <a-menu-item key="interface_test"><router-link to="/res/interfaceTestResult">接口测试结果</router-link></a-menu-item>
          <a-menu-item key="dial_test"><router-link to="/res/dialTestResult">拨测结果</router-link></a-menu-item>
        </a-sub-menu>

      </a-menu>
    </a-layout-sider>
    <a-layout>

      <a-layout-content style="margin: 0 16px">
        <div :style="{ padding: '5px', background: '#fff', minHeight: '360px' }">
          <router-view class="view"></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Designed by 微信测试中心 <br>
        Copyright © 1998-2023 Tencent Inc. All Rights Reserved.
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import axios from 'axios'
import store from './store'

export default {
  data () {
    return {
      collapsed: false,
      selectedKey : this.getSelectedKeys(),
      loginUserEngName : "Guest",
      loginUserChnName : "南极企鹅",
      loginUserAvatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      breadList : []
    }
  },
  methods: {
    getSelectedKeys : function () {
      console.log(window.location.href);
      let url = window.location.href;
      let urlArr = url.split("?")[0].split("/")
      console.log(urlArr);

      // 测试用例部分
      if (urlArr.indexOf("testCases") !== -1)
        return {key:["1"], box: ["1"]};

      // 测试结果部分
      if (urlArr.indexOf("testTask") !== -1)
        return {key:[], box: ["2"]};
      if (urlArr.indexOf("res") !== -1)
      {
        if (urlArr.indexOf("uiTestResult") !== -1)
          return {key:["ui_test"],box: ["2"]};
        if (urlArr.indexOf("interfaceTestResult") !== -1)
          return {key:["interface_test"],box: ["2"]};
        if (urlArr.indexOf("dialTestResult") !== -1)
          return {key:["dial_test"],box: ["2"]};
        return {key:[],box: ["2"]};
      }

      return {key:[], box: ["2"]};
    }
  },

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
