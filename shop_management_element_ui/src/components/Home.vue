<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  methods: {
    // 退出
    logout() {
      // 清空 sessionStorage
      window.sessionStorage.clear()

      // 重定向到登录页
      this.$router.push('login')

      // 提示
      this.$message({
        type: 'success',
        duration: 1000,
        message: '退出成功',
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
