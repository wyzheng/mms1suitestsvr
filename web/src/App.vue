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
              :defaultSelectedKeys="[selectedKey.key]"
              :defaultOpenKeys="[selectedKey.box]"
              mode="inline"
              style="padding-top: 20px">
        <a-menu-item key="1">
          <router-link to="/testCases">
            <a-icon type="dashboard" />
            <span>用例管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/testTask">
            <a-icon type="dashboard" />
            <span>测试任务</span>
          </router-link>
        </a-menu-item>
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
        Copyright © 1998-2022 Tencent Inc. All Rights Reserved.
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
      if (url.search("Dashboard") !== -1)
        return {key:"1", box:""};
      if (url.search("DataFlow") !== -1)
        return {key:'2',box:'sub1'};
      if (url.search("FeatureConsistency") !== -1)
        return {key:'10',box:''};
      if (url.search("FeatureDistribution") !== -1)
        return {key:'99',box:'sub1'};
      if (url.search("FeaturePlatform") !== -1)
        return {key:'56',box:'sub1'};
      if (url.search("Feature") !== -1)
        return {key:'3',box:'sub1'};
      if (url.search("Model") !== -1)
        return {key:'4',box:'sub1'};
      if (url.search("BinConfig") !== -1)
        return {key:'5',box:'sub3'};
      if (url.search("NewCi") != -1)
        return {key:'6',box:'sub3'};
      if (url.search("HistoryTrend") !== -1)
        return {key:'7',box:'sub4'};
      if (url.search("CommonConfig") !== -1)
        return {key:'8',box:'sub4'};
      if (url.search("DocQuality") !== -1)
        return {key:'12',box:''};
      if (url.search("AppManager") != -1)
        return {key:"41",box:''};
      if (url.search("AppList") != -1)
        return {key:"42",box:''};
      if (url.search("AlarmManager") != -1)
        return {key:"43",box:""};
      if (url.search("BusinessList") != -1)
        return {key:"offline_biz",box:"offline"};
      if (url.search("ModelList") != -1)
        return {key:"offline_biz",box:"offline"};
      if (url.search("ModelConfig") != -1)
        return {key:"offline_biz",box:"offline"};
      if (url.search("FileGit") != -1)
        return {key:"file_git",box:"offline"};
      return {key:'1',box:''};
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
