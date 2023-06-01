<template>
  <div>
    <a-card style="margin-top: 2%">
      <a-descriptions title="测试任务信息"  style="width: 96%;margin: auto">
        <a-descriptions-item label="testId"> {{taskData.test_id}}</a-descriptions-item>
        <a-descriptions-item label="状态">{{taskData.status}}</a-descriptions-item>
        <a-descriptions-item label="开始时间">{{taskData.start_time}}</a-descriptions-item>
        <a-descriptions-item label="结束时间">{{taskData.update_time}}</a-descriptions-item>
        <a-descriptions-item label="模板号">{{taskData.template}}</a-descriptions-item>
        <a-descriptions-item label="用例合集数">{{taskData.res[0]}}</a-descriptions-item>
        <a-descriptions-item label="用例个数">{{taskData.res[2]}}</a-descriptions-item>
        <a-descriptions-item label="任务失败用例数">{{taskData.res[4]}}</a-descriptions-item>
        <a-descriptions-item label="用例执行成功率">{{taskData.res[3]}}</a-descriptions-item>-->
      </a-descriptions>
    </a-card>

    <a-card style="margin-top: 2%">
      <a-descriptions title="用例任务列表"  style="width: 96%;margin: auto"></a-descriptions>
      <vxe-toolbar style="width: 96%;margin: auto">
        <template #buttons>
          <vxe-button @click="$refs.xTable.setAllRowExpand(true)">展开所有行</vxe-button>
          <vxe-button @click="$refs.xTable.clearRowExpand()">关闭所有行</vxe-button>
        </template>
      </vxe-toolbar>

      <vxe-table
        border
        stripe
        auto-resize
        highlight-hover-row
        :expand-config="{lazy: true, loadMethod: getCaseTask}"
        :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
        style="width: 96%;margin: auto"
        :loading="is_loading"
        :data="suiteTaskData"
        ref="xTable">
        <vxe-column type="expand" width="80">
          <template #content="{ row }">
            <div class="expand-wrapper">
              <div v-if="row.status === 'fail'" style="display: inline-block; background-color: rgba(188,188,188,0.16); width: 100%; height: auto; border-radius: 10px">
                <pre style="margin-top: 1%" v-html="escapeHTML(row.failure_msg)"></pre>
              </div>
              <vxe-table
                v-else
                border
                stripe
                auto-resize
                highlight-hover-row
                style="width: 96%;margin: auto"
                :loading="is_loading"
                :data="row.caseTaskData"
                ref="table">
<!--                <vxe-column field="suite_desc" sortable title="所属用例模块"></vxe-column>
                <vxe-column field="suite" title="所属用例合集" sortable width="15%">
                  <template #default="{ row }">
                    <span class="vxe-cell&#45;&#45;label">{{getSuite(row)}}</span>
                  </template>
                </vxe-column>-->
                <vxe-column field="func_name" title="用例函数名" width="15%">
                  <template #default="{ row }"><span class="vxe-cell--label">{{getCaseFuncName(row)}}</span>
                  </template>
                </vxe-column>
                <!--        <vxe-column field="case_id" title="case编号"></vxe-column>-->
                <vxe-column field="description" title="用例描述" width="30%"></vxe-column>
<!--                <vxe-column field="owner" title="负责人"></vxe-column>-->
                <vxe-column field="duration" title="耗时(秒)">
                  <template #default="{ row }">{{row.duration / 1000}}</template>
                </vxe-column>
                <vxe-column title="用例状态">
                  <template #default="{ row }">
                    <a-tag :color="getColor(row)">
                      {{sta[row.status]}}
                    </a-tag>
                  </template>
                </vxe-column>
                <vxe-column field="fail_tag" title="失败原因">
                  <template #default="{ row }">
                    <a-tag v-for="item in getTags(row)" :key= item.id color="red">{{item}}</a-tag>
                  </template>
                </vxe-column>

                <vxe-column field="details" title="运行详情">
                  <template #default="{ row }">
                    <a-button @click="showModal(row)"> 运行详情 </a-button>
                  </template>
                </vxe-column>
              </vxe-table>
              <a-row>
                <a-col :span="22">
                </a-col>
                <a-button type="primary" size="mini" @click="$refs.xTable.toggleRowExpand(row)" style="margin-top: 1%;margin-right: 2%">
                  收起
                </a-button>
              </a-row>
            </div>
          </template>
        </vxe-column>

        <vxe-column field="suite_desc" sortable title="所属用例模块"></vxe-column>
        <vxe-column field="suite_id" title="所属用例合集" sortable width="15%"></vxe-column>
        <vxe-column field="owner" title="负责人"></vxe-column>
        <vxe-column field="duration" title="耗时(秒)">
          <template #default="{ row }">{{row.duration / 1000}}</template>
        </vxe-column>
        <vxe-column field="status" title="用例状态">
          <template #default="{ row }" #content="{row1}">
            <a-tooltip  title="点击展开执行详情" >
              <a-tag :color="row.status.indexOf('success') !== -1 ? 'green' : 'red'" @click="$refs.xTable.toggleRowExpand(row)">
                {{suiteSta[row.status]}}
              </a-tag>
            </a-tooltip>

            <a-tooltip  title="点击展开执行详情" >
              <a-tag v-if="row.status === 'fail+success'" color="red" @click="$refs.xTable.toggleRowExpand(row)">
                用例失败
              </a-tag>
            </a-tooltip>
          </template>
        </vxe-column>
        <vxe-column field="result" title="测试结果">
          <template #default="{ row }">
            <div v-html="getSuiteRes(row)"></div>
          </template>
        </vxe-column>
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

    <a-modal :visible="visible"
             width="80%"
             @ok="handleOk"
             @cancel="handleOk"
             title="运行详情"
             :ok-text="'确认'"
             :cancel-text="'取消'">
      <a-card>
        <a-descriptions title="测试详情"  style="width: 96%;margin: auto">
          <a-descriptions-item label="testId"> {{taskData.test_id}}</a-descriptions-item>
          <a-descriptions-item label="模板号">{{taskData.template}}</a-descriptions-item>
          <a-descriptions-item label="用例地址">
            <a
              :href="getCaseUrl(rowData)"
              target="_blank"
            >{{ getCaseFuncName(rowData)  }}</a
            >
          </a-descriptions-item>
<!--          <a-descriptions-item label="用例">{{getCaseFuncName(rowData)}}</a-descriptions-item>-->
          <a-descriptions-item label="用例描述">{{rowData.description}}</a-descriptions-item>
          <a-descriptions-item :color="getColor(rowData)" label="状态">{{sta[rowData.status]}}</a-descriptions-item>
          <a-descriptions-item label="开始时间">{{taskData.start_time}}</a-descriptions-item>
          <a-descriptions-item label="耗时">{{rowData.duration / 1000}}秒</a-descriptions-item>
          <a-descriptions-item label="负责人">{{rowData.owner}}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card v-if="rowData.failure_msg !== ''">
        <a-row>
          <a-col :span=2>
            <p>错误信息：</p>
          </a-col>
          <a-col :span=9>
            <a-tag v-for="item in getTags(rowData)" :key= item.id color="red">{{item}}</a-tag>
          </a-col>
        </a-row>

        <div style="display: inline-block; background-color: rgba(188,188,188,0.16); width: 100%; height: auto; border-radius: 10px">
          <pre style="margin-top: 1%"> {{rowData.failure_msg}} </pre>
        </div>
      </a-card>

      <a-card v-if="attachData.length !== 0">
        <p>附加信息：</p>
        <div v-for="item in attachData"
             :key= item.createTime
             style="display: inline-block; background-color: rgba(188,188,188,0.16); width: 90%; height: auto; border-radius: 10px">
          <pre style="margin-top: 1%"> {{item.description}} </pre>
        </div>
      </a-card>

      <a-card v-if="attachFile.length !== 0" style="margin-top: 1%">
        <p> 截图信息：</p>
        <a-row>
          <div v-for="item in attachFile" :key= item.createTime style="display: inline-block">
            <img :src="url + item.filePath.substr(1)" :alt= "item.description" width="30%" height="35%"/>
            <p>{{item.description}}</p>
          </div>
        </a-row>
      </a-card>
    </a-modal>

<!--    <iframe style="width: 90%; height: 1000px" :src="url">
    </iframe>-->
  </div>
</template>

<script>
import axios from "axios";
import AnsiToHtml from "ansi-to-html"

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
      },
      visible: false,
      attachData: [],
      attachFile: [],
      taskData: {},
      suiteSelect: [],
      selectedValue: "",
      formState: {},
      rowData: {},
      suiteTaskData: [],
      allSuiteData: [],
      suiteSta:{
        success: "执行成功",
        fail: "执行失败",
        'fail+success': "执行成功"
      },
    }
  },

  mounted() {
    let _this = this;
    _this.id = _this.$route.query.id;
    console.log(_this.id);
    _this.getAllSuiteTask();
   // _this.getAllCaseTask();
    _this.getTaskDetail();
    axios({
      method : "get",
      url : "/cgi/backend/GetReport",
      params: {
        id: _this.id
      }
    }).then(function (response) {
      if (0 === response.data.Ret) {
        _this.url = "http://9.134.52.227"
      } else {
        _this.$message.error(`获取测试报告失败！Ret：${response.data.Message}`);
      }
    }).catch(function (error) {
      console.log(error);
      _this.$message.error("获取测试报告失败！");
    });
  },

  methods: {
    test (row){
      console.log("########");
      this.$refs.xTable.toggleRowExpand(row);
    },
    getAllSuiteTask: async function () {
      let _this = this;
      _this.is_loading = true;
      await axios({
        method: "get",
        url: "/cgi/GetTestSuiteTaskDetail",
        params: {
          id: _this.id
        }
      }).then(function (response) {
        console.log(response.data)
        if (0 === response.data.Ret) {
          _this.is_loading = false;
          _this.allSuiteData = response.data.Data;
          _this.tablePage.totalResult = response.data.Data.length;
          _this.suiteTaskData = _this.allSuiteData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize);
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

    getCaseTask: async function (row) {
      let _this = this;
      _this.is_loading = true;
      console.log(row.row.suite_id);
      await axios({
        method: "get",
        url: "/cgi/GetCaseTaskDetail",
        params: {
          id: _this.id,
          suite_id: row.row.suite_id
        }
      }).then(function (response) {
        console.log(response.data)
        /*_this.allData = [];
        _this.caseTaskData = [];*/
        if (0 === response.data.Ret) {
          _this.is_loading = false;
          row.row.caseTaskData = response.data.Data;
          console.log(row);
          //_this.allData = response.data.Data;
          // _this.tablePage.totalResult = response.data.Data.length;
          // _this.caseTaskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize);
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

    getTaskDetail: async function () {
      let _this = this;
      _this.is_loading = true;
      await axios({
        method: "get",
        url: "/cgi/GetTestTaskByTestId",
        params: {
          id: _this.id
        }
      }).then(function (response) {
        console.log(response.data.Data);
        _this.taskData = response.data.Data;
        _this.taskData.start_time = new Date(_this.taskData.start_time).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
        _this.taskData.update_time = new Date(_this.taskData.update_time).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
        _this.taskData.status = _this.getStatus(_this.taskData);
        _this.taskData.res = _this.dealTestRes(_this.taskData)
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载测试任务详情失败！");
        _this.is_loading = false;
      });
    },
    handlePageChange: function ({currentPage, pageSize}) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      console.log(this.allData);
      this.suiteTaskData = this.allSuiteData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
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


    getTags: function (row) {
      console.log(row);
      let tagArr = []
      if (row.failure_tag != null) {
        let tags = row.failure_tag.split("#")
        for (let i = 0; i < tags.length - 1; i++) {
          tagArr.push(this.failTag[tags[i]])
        }
        console.log(tagArr);
      }
      return tagArr
    },
    showModal: function (row) {
      console.log(row);
      this.visible = true;
      this.rowData = row;
      console.log(row);
      console.log(JSON.parse(row.attach_info));
      let attachInfo = JSON.parse(row.attach_info)
      this.attachData = [];
      this.attachFile = [];
      for (let i = 0; i < attachInfo.length; i++) {
        if (JSON.parse(attachInfo[i]).filePath !== undefined) {
          this.attachFile.push(JSON.parse(attachInfo[i]))
        } else {
          this.attachData.push(JSON.parse(attachInfo[i]))
        }
      }
    },
    handleOk: function () {
      this.visible = false;
    },
    dealTestRes: function (row) {
      if (row.test_result !== null) {
        let res = row.test_result.split("_");
        let suiteNum = Number(res[0]) + Number(res[1]);
        let suitePer = 0.0 + "%";
        if (suiteNum !== 0) {
          suitePer = ((Number(res[1]) / suiteNum) * 100).toFixed(1) + "%";
        }
        let caseNum = Number(res[2]) + Number(res[3]);
        let casePer = 0.0 + "%";
        if (caseNum !== 0) {
          casePer = ((Number(res[3]) / caseNum) * 100).toFixed(1) + "%";
        }
        let errNum = 0;
        if (res.length == 5) {
          errNum = Number(res[4])
        }
        return [suiteNum, suitePer, caseNum, casePer, errNum];
      } else {
        return [0, 0, 0, 0];
      }
    },

    getStatus: function (row) {
      return row.status === "TASK_TEST_FINISHED" ? "完成" : "测试中";
    },
    getColor: function (row) {
      return row.status === "passed" ? "green" : "red";
    },

    getSuite: function (row) {
      let caseId = row.case_id;
      let arr = caseId.split(".");
      let suite = "";
      let index = caseId.indexOf(arr[arr.length - 1]);
      return caseId.substr(0, index - 1);
    },
    getCaseFuncName: function (row) {
      if (row.case_id !== undefined) {
        let arr = row.case_id.split(".");
        return arr[arr.length - 1];
      }
    },

    getCaseUrl: function (row) {
      let git = "https://git.woa.com/mmtest/search-ui-test-base/blob/master/__tests__";
      console.log(row);
      if (row.case_id !== undefined) {
        let arr = row.case_id.split(".");
        for (let i = 0; i < arr.length - 1; i++) {
          git += "/";
          git += arr[i];
        }
        return git + ".spec.ts#L" + row.start_line;
      } else {
        return git;
      }
    },

    getSuites: function () {
      let suiteArr = [];
      this.suiteSelect = [];
      for (let i = 0; i < this.allData.length; i++) {
        let suite = this.getSuite(this.allData[i]);
        console.log("%%%%%");
        if (suiteArr.indexOf(suite) === -1) {
          let item = {
            value: suite,
            label: suite,
          }
          this.suiteSelect.push(item);
          suiteArr.push(suite)
        }
      }
    },
    handleChange: function (value) {
      this.selectedValue = value;
    },
    filterTableData: function () {
      console.log(this.selectedValue);
      let _this = this;
      this.is_loading = true;
      let filterData = [];
      for (let i = 0; i < this.allData.length; i++) {
        if (this.allData[i].case_id.indexOf(this.selectedValue) !== -1) {
          filterData.push(this.allData[i]);
        }
      }
      this.allData = filterData;
      _this.tablePage.totalResult = this.allData.length;
      _this.tablePage.currentPage = 1;
      _this.caseTaskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize);
      this.is_loading = false;
    },
    cleanFilter: async function () {
      this.selectedValue = "";
      await this.getAllCaseTask();
    },
    escapeHTML(str) {
      const ansiToHtml = new AnsiToHtml();
      console.log(ansiToHtml.toHtml(str));
      return ansiToHtml.toHtml(str);
    },
    getSuiteRes(row){
      const res = row.test_result.split("_")
      return `测试成功: <span style="color:#52c41a">${res[0]}</span>; 测试失败：<span style="color:#F55">${res[1]}</span>`;
    }
  }

}
</script>

<style scoped>
.template-wrapper {
  display: flex;
  align-items: center;
}

.expand-wrapper {
  padding: 20px;
}

</style>
