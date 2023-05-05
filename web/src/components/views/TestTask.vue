<template>
  <div>
    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="6">
          <span> 最新测试任务结果展示 </span>
        </a-col>
      </a-row>

      <vxe-table
        border
        stripe
        resizable
        highlight-hover-row
        style="width: 96%;margin: auto"
        :data="taskData">
        <vxe-table-column field="id" width="80" title="任务id"></vxe-table-column>
        <vxe-table-column field="template" width="460" title="模板包版本号"></vxe-table-column>
        <vxe-table-column field="update_time" title="任务发起时间" sortable></vxe-table-column>
        <vxe-table-column field="status" width="70" title="状态">
          <template  #default="{ row }">
            <a-tag style="width:50px;" color= "gray" size="mini">{{getStatus(row)}}</a-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="测试结果" width="320">
          <template  #default="{ row }">
            <div v-if="row.status === 'TASK_TEST_FINISHED'">
              <span>共执行{{dealTestRes(row)[0]}}个测试合集，成功率:</span>
              <a-tag style="width:60px;" :color="dealTestRes(row)[1] === '100.0%' ? 'green' : 'red'" size="mini">{{dealTestRes(row)[1]}}</a-tag>
              <br>
              <span>包含{{dealTestRes(row)[2]}}个测试用例，成功率:</span>
              <a-tag style="width:60px;" :color="dealTestRes(row)[3] === '100.0%' ? 'green' : 'red'" size="mini">{{dealTestRes(row)[3]}}</a-tag>
            </div>
            <div v-else>
            暂无测试结果
           </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="report" title="测试报告">
          <template  #default="{ row }">
            <div v-if="row.status === 'TASK_TEST_FINISHED'">
              <a @click="pathTo(row.id)"> 测试报告 </a>
            </div>
            <div v-else>
            暂无测试报告
            </div>
          </template>

        </vxe-table-column>
      </vxe-table>
    </a-card>
    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="6">
          <span> 测试结果统计 </span>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TestTask',
  data () {
    return {
      taskData : [],
      taskStatus : {
        "TASK_TEST_FINISHED": "完成",
        "NEW_TEST_TASK": "测试中",
      },
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
    getAllDataTask : function () {
      let _this = this;
      axios({
        method : "get",
        url : "/cgi/GetTestTask",
      }).then(function (response) {
        if (0 === response.data.Ret) {
          _this.allData = response.data.Data;
          _this.taskData = _this.allData.slice(0, 1)
        } else {
          _this.$message.error(`查询失败！Ret：${response.data.Message}`);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载校验任务列表失败！");
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
