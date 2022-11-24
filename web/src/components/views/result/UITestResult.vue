<template>
  <a-card :bordered="true">
    <a-row style="margin-bottom: 2%; margin-left: 2%">
      <a-col :span="6">
        <span> UI测试结果展示 </span>
      </a-col>
    </a-row>

    <vxe-table
      border
      stripe
      resizable
      highlight-hover-row
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
      style="width: 96%;margin: auto"
      :data="taskData">
      <vxe-table-column field="id" width="160" title="任务id"></vxe-table-column>
      <vxe-table-column field="template" width="460" title="模板包版本号"></vxe-table-column>
      <vxe-table-column field="trigger" title="任务发起方式"></vxe-table-column>
      <vxe-table-column field="update_time" title="任务发起时间" sortable></vxe-table-column>
      <vxe-table-column field="report" title="测试报告">
        <template  #default="{ row }">
          <a @click="pathTo(row.id)"> 测试报告 </a>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      background
      size="small"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.totalResult"
      :page-sizes="[10, 20]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange">
    </vxe-pager>
  </a-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UITestResult',
  data () {
    return {
      taskData : [],
      tablePage: {
        currentPage : 1,
        pageSize : 10,
        totalResult : 0
      }
    }
  },
  mounted() {
    let _this = this;
    _this.getAllDataTask();
  },
  methods: {
    pathTo(id) {
      this.$router.push({
        path: '/reportDetail',
        query: {
          id: id,
        }
      })
    },
    handlePageChange : function ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.taskData = this.allData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
    },
    getAllDataTask : function () {
      let _this = this;
      axios({
        method : "get",
        url : "/cgi/GetTestTask",
      }).then(function (response) {
        if (0 === response.data.Ret) {
          _this.allData = response.data.Data;
          _this.tablePage.totalResult = response.data.Data.length;
          _this.taskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize)
        } else {
          _this.$message.error(`查询失败！Ret：${response.data.Message}`);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载校验任务列表失败！");
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
