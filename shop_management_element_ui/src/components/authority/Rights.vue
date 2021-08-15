<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 作用域插槽 -> 子组件传数据给父组件 -->
          <!-- slot-scope="scope" -> 子组件传给父组件的数据是 scope -->
          <!-- 父组件使用子组件的数据 -->
          <!-- element-ui Table-column Scoped Slot -->
          <!-- —	自定义列的内容，参数为 { row, column, $index } -->
          <!-- header	自定义表头的内容. 参数为 { column, $index } -->
          <template slot-scope="scope">
            <el-tag effect="dark" type="danger" v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag effect="dark" type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag effect="dark" v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Rights',
  data() {
    return {
      // 所欲权限列表
      rightsList: [],
    }
  },
  created() {
    // 获取所有权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')

      // 失败
      if (res.meta.status !== 200) {
        this.$message({
          type: 'error',
          duration: 1000,
          message: '获取权限列表失败!',
        })
      }

      //成功
      this.$message({
        type: 'success',
        duration: 1000,
        message: '获取权限列表成功',
      })

      this.rightsList = res.data
    },
  },
}
</script>
<style lang="less" scoped></style>
