<template>
  <div>
    <iframe style="width: 90%; height: 1000px" :src="url">

    </iframe>
  </div>
</template>

<script>
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
    _this.url = "/cgi/GetTestTaskReport?id=" + encodeURIComponent(_this.id)
  },

}
</script>

<style scoped>

</style>
