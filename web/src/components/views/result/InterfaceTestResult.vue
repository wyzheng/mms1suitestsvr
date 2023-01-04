<template>
  <div>
    <a-card :bordered="true">
      <a-row style="margin-bottom: 2%; margin-left: 2%">
        <a-col :span="12">
          <span style="margin-bottom:10px;text-align: right"> 接口测试统计 </span>
        </a-col>
        <a-col :span="12">
          <div style="margin-bottom:10px;text-align: right">
            <a-button size="small" @click="refreshResult">校验</a-button>
            <a-button size="small" type="primary" @click="createRule">添加用例</a-button>
            <a-button size="small" type="primary" @click="checkRule">全部校验</a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <br>
    <a-card :bordered="true">
      <el-table
        :data="dataResult"
        style="width: 100%">
        <el-table-column
          prop="flag"
          label="id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="count"
          label="总规则数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pass_rate"
          label="通过率">
        </el-table-column>
        <el-table-column
          prop="details"
          label="详情">
          <template slot-scope="scope">
            <a-button @click="()=> showDetail(scope.row.rules)">详情</a-button>
          </template>
        </el-table-column>
      </el-table>
    </a-card>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-table
        :data="dataRule"
        style="width: 100%">
        <el-table-column
          prop="query"
          label="query"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sub_type"
          label="子类型">
        </el-table-column>
        <el-table-column
          prop="recalled"
          label="是否召回">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: 'InterfaceTestResult',
  data () {
    return {
      dialogVisible: false,
      dataResult: [],
      dataRule: [],
      columnsResult: [
        {
          title: 'id',
          dataIndex: 'flag',
          key: 'flag',
        },
        {
          title: '总数',
          dataIndex: 'count',
          key: 'count',
        },
        {
          title: '错误数',
          dataIndex: 'error_count',
          key: 'error_count',
        },
        {
          title: '通过率',
          dataIndex: 'pass_rate',
          key: 'pass_rate',
        },
        {
          title: '详情',
          dataIndex: 'rules',
          key: 'rules',
          scopedSlots: {customRender: 'tags'},
        },
      ],
      columnsRule: [
        {
          title: 'query',
          dataIndex: 'query',
          key: 'query',
        },
        {
          title: '主类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '子类型',
          dataIndex: 'sub_type',
          key: 'sub_type',
        },
        {
          title: '是否召回',
          dataIndex: 'recalled',
          key: 'recalled',
        },
        {
          title: 'logtrace状态',
          dataIndex: 'status',
          key: 'status',
        },
      ],
    }
  },
  mounted() {
    let _this = this;
    _this.getResult();
  },
  methods: {
    getResult: function () {
      let _this = this;
      axios({
        method: "get",
        url: "/interfaceTest/list_result",
      }).then(function (response) {
        let dataOrigin = response.data;
        for (var i = 0; i < dataOrigin.length; i++){
          dataOrigin[i]["key"] = (i + 1).toString();
          dataOrigin[i]["detail"] = "详情";
        }
        _this.dataResult = dataOrigin
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载数据失败！");
      });
    },
    showDetail: function (data) {
      console.log(data);
      this.dataRule = data;
      this.dialogVisible = true;
    },
    getAllData: function () {
      let _this = this;
      axios({
        method: "get",
        url: "/interfaceTest",
      }).then(function (response) {
        let dataOrigin = response.data;
        for (var i = 0; i < dataOrigin.length; i++){
          dataOrigin[i]["key"] = (i + 1).toString();
        }
        _this.dataSource = dataOrigin
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载数据失败！");
      });
    },
    createRule: function (){},
    checkRule: function () {
      let _this = this;
      axios({
        method: "get",
        url: "/interfaceTest/check",
      }).then(function (response) {
        if(!_this.dataSource) {
          _this.dataSource = response.data
        }
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("加载数据失败！");
      });
    },
    refreshResult: function () {
      let _this = this;
      axios({
        method: "get",
        url: "/interfaceTest/check",
      }).then(function (response) {
        _this.dataSource = response.data
      }).catch(function (error) {
        console.log(error);
        _this.$message.error("校验失败！");
      });
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
