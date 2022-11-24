<template>
  <div>
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
      url: ""
    }
  },

  mounted() {
    let _this = this;
    _this.id = _this.$route.query.id;
    console.log(_this.id);
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
    //_this.url = "http://9.134.52.227/"
  },

}
</script>

<style scoped>

</style>
