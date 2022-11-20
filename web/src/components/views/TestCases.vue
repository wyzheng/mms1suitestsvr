<template>
  <a-card :bordered="true">
    <a-row style="margin-bottom: 2%; margin-left: 2%">
      <a-col :span="6">
        <span> 测试用例管理 </span>
      </a-col>
    </a-row>

    <vxe-table
      border
      stripe
      resizable
      highlight-hover-row
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
      style="width: 96%;margin: auto"
      :data="caseData">
      <vxe-table-column field="id" width="160" title="id"></vxe-table-column>
      <vxe-table-column field="file_name" width="460" title="用例名称"></vxe-table-column><!--
      <vxe-table-column field="tag" title="任务发起方式"></vxe-table-column>-->
      <vxe-table-column field="owner" title="负责人" sortable></vxe-table-column>
      <vxe-table-column field="update_time" title="更新时间" sortable></vxe-table-column>
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
import axios from "axios";

export default {
  name: "TestCases",
  data () {
    return {
      caseData : [],
      tablePage: {
        currentPage : 1,
        pageSize : 10,
        totalResult : 0
      }
    }
  },
  mounted() {
    let _this = this;
    _this.getAllTestCases();

  },
  methods: {
    handlePageChange : function ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.taskData = this.allData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
    },
    getAllTestCases : function () {
      let _this = this;
      axios({
        method : "get",
        url : "/cgi/GetTestCases",
      }).then(function (response) {
        if (0 === response.data.Ret) {
          _this.allData = response.data.Data;
          _this.tablePage.totalResult = response.data.Data.length;
          _this.caseData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize)
        } else {
          _this.$message.error(`查询失败！Ret：${response.data.Message}`);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("获取用例列表失败！");
      });
    }

  }
}
</script>

<style scoped>

</style>
