<template>
  <a-table :dataSource="dataSource" :columns="columns" />
</template>
<script>
  import axios from "axios";

  export default {
    name: 'InterfaceTestResult',
    data () {
      return {
        dataSource: [],
        columns: [
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
            dataIndex: 'is_recalled',
            key: 'is_recalled',
          },
        ],
      }
    },
    mounted() {
      let _this = this;
      _this.getAllData();
    },
    methods: {
      getAllData: function () {
        let _this = this;
        axios({
          method: "get",
          url: "/interfaceTest",
        }).then(function (response) {
          _this.dataSource = response.data
        }).catch(function (error) {
          console.log(error);
          _this.$message.error("加载数据失败！");
        });
      }
    }
  };
</script>
