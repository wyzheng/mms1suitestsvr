<template>
  <div>
    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="6">
          <span> UI测试最新结果展示 </span>
        </a-col>
      </a-row>

      <a-descriptions style="margin-bottom: 2%; margin-left: 2%" >
        <a-descriptions-item label="处理人">joycesong</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{latestData[0].update_time}}</a-descriptions-item><br>
        <a-descriptions-item label="测试合集数目">{{dealTestRes(latestData[0])[0]}}</a-descriptions-item>
        <a-descriptions-item label="测试合集成功率">{{dealTestRes(latestData[0])[1]}}</a-descriptions-item><br>
        <a-descriptions-item label="测试用例个数">{{dealTestRes(latestData[0])[2]}}</a-descriptions-item>
        <a-descriptions-item label="测试用例执行成功率">{{dealTestRes(latestData[0])[3]}}</a-descriptions-item>

      </a-descriptions>
      <a-row>
        <a-col :span="8">
        </a-col>
        <a-col :span="12">
          <div style="margin-bottom:10px; text-align: right">
            前往<a style="white-space:nowrap" target="_blank" href="https://devops.woa.com/console/pipeline/mmsearch-devops/p-35cd25f80dd34633967cae4e77015e31/preview">蓝盾</a>，触发测试任务
          </div>
        </a-col>
      </a-row>
    </a-card>

    <a-card>
      <vxe-table
        border
        stripe
        resizable
        highlight-hover-row
        :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
        style="width: 96%;margin: auto"
        :loading="is_loading"
        :data="taskData">
        <vxe-table-column field="id" width="80" title="任务id"></vxe-table-column>
        <vxe-table-column field="template" width="360" title="模板包版本号"></vxe-table-column>
        <vxe-table-column field="update_time" title="任务发起时间" sortable></vxe-table-column>
        <vxe-table-column field="status" width="70" title="状态">
          <template  #default="{ row }">
            <a-tag style="width:50px;" color= "gray" size="mini">
              {{getStatus(row)}}
            </a-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="测试结果" width="320">
          <template  #default="{ row }">
            <div v-if="row.status === 'TASK_TEST_FINISHED'">
              <span>共执行{{dealTestRes(row)[0]}}个测试合集，成功率:</span>
              <a-tag style="width:60px;" :color="dealTestRes(row)[1] === '100.0%' ? 'green' : 'red'" size="mini">
                {{dealTestRes(row)[1]}}
              </a-tag>
              <br>
              <span>包含{{dealTestRes(row)[2]}}个测试用例，成功率:</span>
              <a-tag style="width:60px;" :color="dealTestRes(row)[3] === '100.0%' ? 'green' : 'red'" size="mini">
                {{dealTestRes(row)[3]}}
              </a-tag>
            </div>
            <span v-else>
            暂无测试结果
          </span>
          </template>

        </vxe-table-column>
        <vxe-table-column field="report" title="测试报告">
          <template  #default="{ row }">
            <div v-if="row.status === 'TASK_TEST_FINISHED'">
              <a @click="pathTo(row.id)"> 测试报告 </a>
            </div>
            <span v-else>
            暂无测试报告
          </span>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UITestResult',
  data () {
    return {
      taskData : [],
      allData: [],
      tablePage: {
        currentPage : 1,
        pageSize : 10,
        totalResult : 0
      },
      latestData: [
        {
          update_time: "",
          test_result:"0_0_0_0"
        }
      ],
      is_loading:false
    }
  },
  mounted() {
    let _this = this;
    console.log("******");
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
    handlePageChange: function ({currentPage, pageSize}) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      console.log(this.allData);
      this.taskData = this.allData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
    },
    getAllDataTask: async function () {
      let _this = this;
      _this.is_loading = true;
      await axios({
        method: "get",
        url: "/cgi/GetTestTask",
      }).then(function (response) {
        console.log(response.data)
        if (0 === response.data.Ret) {
          _this.is_loading = false;
          _this.allData = response.data.Data;
          _this.tablePage.totalResult = response.data.Data.length;
          _this.taskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize);
          _this.latestData = _this.allData.slice(0, 1);
          console.log(_this.latestData);
        } else {
          _this.$message.error(`查询失败！Ret：${response.data.Message}`);
          _this.is_loading = false;
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载校验任务列表失败！");
        _this.is_loading = false;
      });
    },
    dealTestRes: function (row){
      if (row.test_result !== null){
        let res = row.test_result.split("_");
        let suiteNum = Number(res[0]) + Number(res[1]);
        let suitePer = 0.0 + "%" ;
        if (suiteNum !== 0){
         suitePer = ((Number(res[1]) / suiteNum) * 100).toFixed(1)+ "%" ;
        }
        let caseNum = Number(res[2]) + Number(res[3]);
        let casePer = 0.0 + "%";
        if (caseNum !== 0){
          casePer = ((Number(res[3]) / caseNum) * 100).toFixed(1)+"%" ;
        }
        return [suiteNum, suitePer, caseNum, casePer];
      }else {
        return [0, 0, 0, 0];
      }
    },

    getStatus: function (row){
      return row.status === "TASK_TEST_FINISHED" ? "完成" : "测试中";
    },

    startTest(){
      axios({
        method: "post",
        url: "/process/api/external/pipelines/b970b85149374ea492fbfe651f60843e/build",
        headers: {"Content-Type": "application/json", "X-DEVOPS-PROJECT-ID": "mmsearch-devops", "X-DEVOPS-UID": ""}
      }).then(function (response) {
        if (0 === response.data.Ret) {
          this.$message.success("测试流水线触发成功");
        } else {
          this.$message.error(`流水线触发失败：${response.data.Message}`);
        }
      }).catch(function (error) {
        console.log(error);
        this.$message.error("流水线触发失败");
      });
    }
  },
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
