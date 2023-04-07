<template>
  <div>

    <a-card>
      <vxe-table
        border
        stripe
        resizable
        highlight-hover-row
        :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
        style="width: 96%;margin: auto"
        :loading="is_loading"
        :data="caseTaskData">
        <vxe-table-column field="case_id" title="case编号"></vxe-table-column>
        <vxe-table-column field="description" title="用例描述"></vxe-table-column>
        <vxe-table-column field="owner" title="负责人"></vxe-table-column>
        <vxe-table-column field="duration" title="耗时(秒)"></vxe-table-column>
        <vxe-table-column title="用例状态">
          <template #default="{ row }">
            <a-tag :color="getStatus(row)">
              {{sta[row.status]}}
            </a-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column field="fail_tag" title="失败原因">
          <template #default="{ row }">
            <a-tag v-for="item in getTags(row)" color="red">
              {{item}}
            </a-tag>
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

    <iframe style="width: 90%; height: 1000px" :src="url">

    </iframe>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "reportDetail",
  data () {
    return {
      id : 0,
      url: "",
      caseTaskData: [],
      allData:[],
      is_loading:false,
      tablePage: {
        currentPage : 1,
        pageSize : 10,
        totalResult : 0
      },
      sta:{
        errored: "任务失败",
        passed: "通过",
        failed: "不通过"
      },
      failTag:{
        assertError: "断言失败",
        elementNonExist: "元素不存在",
        dataTimeout: "后台数据超时",
        Timeout: "任务超时",
        unknown: "未知错误"
      }
    }
  },

  mounted() {
    let _this = this;
    _this.id = _this.$route.query.id;
    console.log(_this.id);
    _this.getAllCaseTask();
    axios({
      method : "get",
      url : "/cgi/backend/GetReport",
      params: {
        id: _this.id
      }
    }).then(function (response) {
      if (0 === response.data.Ret) {
        _this.url = "http://9.134.52.227/"
      } else {
        _this.$message.error(`获取测试报告失败！Ret：${response.data.Message}`);
      }
    }).catch(function (error) {
      console.log(error);
      _this.$message.error("获取测试报告失败！");
    });
  },

  methods:{
    handlePageChange: function ({currentPage, pageSize}) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      console.log(this.allData);
      this.caseTaskData = this.allData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
    },
    getAllCaseTask: async function () {
      let _this = this;
      _this.is_loading = true;
      await axios({
        method: "get",
        url: "/cgi/GetCaseTaskDetail",
        params: {
          id: _this.id
        }
      }).then(function (response) {
        console.log(response.data)
        if (0 === response.data.Ret) {
          _this.is_loading = false;
          _this.allData = response.data.Data;
          _this.tablePage.totalResult = response.data.Data.length;
          _this.caseTaskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize);
        } else {
          _this.$message.error(`查询失败！Ret：${response.data.Message}`);
          _this.is_loading = false;
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载测试任务列表失败！");
        _this.is_loading = false;
      });
    },

    getStatus: function (row){
      return row.status=== "passed" ? "green" : "red";
    },
    getTags: function (row){
      console.log(row);
      let tagArr = []
      if (row.failure_tag != null){
        let tags = row.failure_tag.split("#")
        for (let i = 0; i < tags.length - 1; i++) {
          tagArr.push(this.failTag[tags[i]])
        }
        console.log(tagArr);
      }
      return tagArr
    }
  }

}
</script>

<style scoped>

</style>
