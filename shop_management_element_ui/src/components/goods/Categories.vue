<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCategoryDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <div class="icon-wrap">
            <i
              class="el-icon-success icon"
              v-if="scope.row.cat_deleted === false"
              style="color: #3c934c"
            ></i>
            <i class="el-icon-error icon" v-else style="color: red"></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="small"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >
            二级
          </el-tag>
          <el-tag size="small" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option">
          <el-button
            size="small"
            round
            type="primary"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            size="small"
            round
            type="warning"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="45%"
      @close="addCategoryDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryFormRules"
        ref="addCategoryFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <!-- options：数据源 -->
          <!-- props：指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCategoryList"
            :props="cascaderProps"
            @change="parentCategoryChange"
            clearable
            change-on-select
            style="width: 100%"
            placeholder="请选择(可以不进行选择)"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类对话框 -->
    <!-- <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="30%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryDialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  name: 'Categories',
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据, 默认为空
      categoryList: [],
      // 总数据条数
      total: 0,
      // 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          // 表示当前列使用的模板名称
          template: 'option',
        },
      ],
      // 控制添加分类对话框的显示
      addCategoryDialogVisible: false,
      // 添加分类的表单数据
      addCategoryForm: {
        // 将要添加的分类名称
        cat_name: '',
      },
      // 添加分类表单的验证规则
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 分类父级id
      cat_pid: 0,
      // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
      cat_level: 0,
      // 分级分类数据
      parentCategoryList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的父级分类的 id 数组
      selectedKeys: [],
    }
  },
  created() {
    // 获取分类数据
    this.getCategoryList()
  },
  methods: {
    // 获取分类数据
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: '获取商品分类失败!',
        })
      }

      this.categoryList = res.data.result
      this.total = res.data.total

      this.$message({
        type: 'success',
        duration: 1000,
        message: '获取商品分类成功!',
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // 更新页大小(每一页显示的数量)
      this.queryInfo.pagesize = newSize
      // 请求数据
      this.getCategoryList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // 更新页码(新的一页)
      this.queryInfo.pagenum = newPage
      // 请求数据
      this.getCategoryList()
    },
    // 点击按钮展示添加分类对话框
    showAddCategoryDialog() {
      // 获取父级分类数据
      this.getParentCategoryList()
      // 显示对话框
      this.addCategoryDialogVisible = true
    },
    // 获取父级分类数据
    async getParentCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '获取父级分类数据失败!',
          duration: 1000,
        })
      }
      this.parentCategoryList = res.data

      this.$message({
        type: 'success',
        message: '获取父级分类数据成功!',
        duration: 1000,
      })
    },
    // 选择项发生改变触发事件
    parentCategoryChange() {
      if (this.selectedKeys.length > 0) {
        // 如果 selectedKeys 数组中的 length > 0 即选中了父级分类
        // 找到最后一项 父级分类 id
        // 否则，没有选中任何父级分类
        this.addCategoryForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCategoryForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类 id
        this.addCategoryForm.cat_pid = 0
        this.addCategoryForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCategory() {
      this.$refs.addCategoryFormRef.validate(async validate => {
        if (!validate) return

        const { data: res } = await this.$http.post(
          'categories',
          this.addCategoryForm
        )
        if (res.meta.status !== 201)
          return this.$message({
            type: 'error',
            message: '添加分类失败!',
            duration: 1000,
          })

        this.$message({
          type: 'success',
          message: '添加分类成功!',
          duration: 1000,
        })
        this.getCategoryList()
        this.addCategoryDialogVisible = false
      })
    },
    // 监听对话框的关闭事件, 重置表单数据
    addCategoryDialogClosed() {
      this.$refs.addCategoryFormRef.resetFields()
      this.selectedKeys = []
      this.addCategoryForm.cat_level = 0
      this.addCategoryForm.cat_pid = 0
    },
  },
}
</script>
<style lang="less" scoped>
.tree-table {
  font-size: 14px;
  margin-top: 20px;
}
// .icon-wrap {
.icon {
  font-size: 18px;
}
.el-pagination {
  margin-top: 20px;
}
.el-cascader {
  width: 100px;
}
</style>
