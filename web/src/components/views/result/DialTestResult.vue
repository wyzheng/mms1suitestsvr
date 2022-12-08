<template>
  <div>
    <h2>{{ msg }}</h2>
    <hr>

    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="12">
          <span style="margin-bottom:10px;text-align: right"> 拨测信息 </span>
        </a-col>
        <a-col :span="12">
          <div style="margin-bottom:10px;text-align: right">
            <a-button size="small" @click="getDailTestResult">刷新</a-button>
            <a-button size="small" type="primary" @click="createRule">添加用例</a-button>
            <a-button size="small" type="primary" @click="createRule">全部校验</a-button>
          </div>
        </a-col>
      </a-row>
      <a-descriptions style="margin-bottom: 2%; margin-left: 2%" v-if="namespace">
        <a-descriptions-item label="召回检查方式">{{namespace.recall_type === 0 ?  'docid检查' : namespace.recall_type === 1 ?  '文字标题检查' :  namespace.recall_type === 2 ? '隐私合规检查': '其它'}}</a-descriptions-item>
        <a-descriptions-item label="规则总数">{{namespace.rule_count}}</a-descriptions-item>
        <a-descriptions-item label="错误总数">{{namespace.error_rule_count}}（{{(namespace.error_rate * 100).toFixed(2)}}%）</a-descriptions-item>
        <a-descriptions-item label="创建人">{{namespace.creator}}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{namespace.update_time}}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{namespace.create_time}}</a-descriptions-item>
        <a-descriptions-item label="执行耗时">{{namespace.cost_time_str}}</a-descriptions-item>
      </a-descriptions>
      <div style="margin-bottom:10px;text-align: right">
        前往<a style="white-space:nowrap" :href="'https://lipstick.woa.com/#/rule_list/'+ns_id" target="_blank">lipstick</a>，获取更多详情结果
      </div>
    </a-card>
    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="6">
          <span> 拨测结果 </span>
        </a-col>
      </a-row>

      <vxe-table
        border
        stripe
        resizable
        highlight-hover-row
        :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
        style="width: 96%;margin: auto; white-space:nowrap"
        :loading="is_loading"
        :data="taskData">
        <vxe-table-column align="center" field="id" title="编号"></vxe-table-column>
        <vxe-table-column align="center" field="query" title="query"></vxe-table-column>
        <vxe-table-column align="center" field="business_type_desc" title="业务类型"></vxe-table-column>
        <vxe-table-column align="center" field="sub_business_type_desc" title="子类型" sortable></vxe-table-column>
        <vxe-table-column align="center" field="scope_desc" title="搜索类型" sortable></vxe-table-column>
        <vxe-table-column align="center" field="update_time" title="更新时间"></vxe-table-column>
        <vxe-table-column align="center" field="status_desc" title="最新状态">
          <template  #default="{row}">
            <div><a-tag style="width:60px;" :color="row.status < 4 ? status_type[row.status]: (row.fail_reason === 0 ? 'green' : 'red')" size="mini" v-if="row.status>=0">
              {{row.status !== 4 ? row.status_desc : row.fail_desc}}</a-tag></div>
          </template>
        </vxe-table-column>
        <vxe-table-column align="center" field="report" title="操作">
          <template  #default="{ row }"><div align="center">
            <a style="white-space:nowrap" :href="'https://lipstick.woa.com/#/rule_detail/'+row.rule_id" target="_blank">详情</a>
            <a-button @click="check_cases(row.rule_id)" type="link" size="small">校验</a-button>
            <a style="white-space:nowrap" :href="'https://lipstick.woa.com/#/modify_rule/'+row.rule_id" target="_blank">修改规则</a>
          </div></template>>
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
import { Modal } from 'ant-design-vue';
export default {
  name: "DialTestResult",
  data () {
    return {
      msg: "拨测结果详情",
      taskData : [],  // 所有拨测结果
      is_loading: false,  // todo 以后补充加载逻辑
      namespace: null,
      tablePage: {
        currentPage : 1,
        pageSize : 20,
        totalResult : 0,
        status_type: {
          0: "green",
          1: "",
          2: "",
          3: "orange",
        },
      },
      ns_id:  460,  // 拨测任务的命名空间id
      oa_ticket: ""
    }
  },
  mounted() {
    let _this = this;
    _this.update_lipactk()
  },
  methods: {
    get_ns_info: function (){
      let _this = this;
      axios({
        method : "get",
        url : "/lipstick/namespace/info/"+this.ns_id,
        headers: {"Wx-Ac-Ticket": _this.oa_ticket}
      }).then(function (response) {
        if (200 === response.status) {
          // console.info(response.data);
          _this.namespace = response.data;
        } else {
          _this.$message.error(`查询拨测结果失败！Ret：${response.status}`);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("查询拨测结果失败！");
      });
    },
    update_lipactk: async function() {
      // 更新完Token会自动更新数据
      let _this = this;
      await axios({
        method : "get",
        url : "/static/diff/lipactk.txt ",
        headers: {"Secret":"svrkithooklab"}
      }).then(function (response) {
        if (200 === response.status) {
          _this.oa_ticket = response.data.replace(/[\s\n\t]+$/g, "");
        } else {
          _this.$message.error(`查询拨测结果失败！Ret：${response.status}`);
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("查询拨测结果失败！");
      });
      _this.getDailTestResult();
      _this.get_ns_info()
    },
    check_cases: function (rule_id){
      let _this = this;
      // console.info(rule_id)
      _this.$message.info({
        content: () => '点击【详情】，前往lipstick发起拨测',
        class: 'custom-class',
        style: {
          "text-align": "center",
        },
      });
    },
    createRule: function (){
      // todo
    },
    handlePageChange: function ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.taskData = this.allData.slice((this.tablePage.currentPage - 1) * this.tablePage.pageSize, this.tablePage.currentPage * this.tablePage.pageSize);
    },
    getDailTestResult: function () {
      let _this = this;
      _this.is_loading = true;
      axios({
        method: "post",
        url: "/lipstick/rule/list",
        data: {
          ns_id: _this.ns_id
        },
        headers: {"Wx-Ac-Ticket": _this.oa_ticket, "Content-Type": "application/json"}
      }).then(function (response) {
        if (200 === response.status) {
          //  todo 这里写请求成功后的操作, 以后处理下切片操作
          // setTimeout(() => {
          //   _this.taskData = response.data.rules;
          //   _this.tablePage.totalResult = response.data.total;
          //   _this.tablePage.pageSize = response.data.page_size;
          //   _this.is_loading = false
          // }, 1000)


          _this.taskData = response.data.rules;
          _this.tablePage.totalResult = response.data.total;
          _this.tablePage.pageSize = response.data.page_size;
          _this.is_loading = false


          // _this.allData = response.data.rules;
          // _this.taskData = _this.allData.slice((_this.tablePage.currentPage - 1) * _this.tablePage.pageSize, _this.tablePage.currentPage * _this.tablePage.pageSize)
        } else {
          _this.$message.error(`查询失败！Ret：${response.status}`);
          _this.is_loading = false
        }
        console.log(response);
      }).catch(function (error) {
        console.error(error);
        _this.is_loading = false
        _this.$message.error("加载拨测结果失败！");
      });
    }
  }
}
</script>

<style scoped>

</style>
