<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="categoryList"
            v-model="selectedCategoryKeys"
            :props="categoryProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button @click="addParamDialogVisible = true" type="primary" size="small" :disabled="isBtnDisable">
            添加参数
          </el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button @click="addParamDialogVisible = true" type="primary" size="small" :disabled="isBtnDisable">
            添加属性
          </el-button>

          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="titleText" :visible.sync="addParamDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类数据
      categoryList: [],
      // 级联选择框的配置对象
      categoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定的数组
      selectedCategoryKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      //静态参数数据
      onlyTableData: [],
      // 控制添加参数对话框的显示
      addParamDialogVisible: false,
      // 添加表单的数据对象
      addFrom: {
        attr_name: '',
      },
      // 添加表单的验证规则
      addFromRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      //   编辑对话框
      editDialogVisible: false,
      //   修改表单数据对象
      editFrom: {},
      //   修改表单验证规则
      editFromRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    // 获取所有商品分类
    this.getCategoryList()
  },
  methods: {
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          durattion: 1000,
          message: '获取商品分类失败!',
        })
      }
      this.categoryList = res.data
      this.$message({
        type: 'success',
        durattion: 1000,
        message: '获取商品分类成功!',
      })
    },
    // 级联选择框选中项变化触发事件
    handleChange() {
      this.getParamsData()
    },
    // Tab 页签点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数数据
    async getParamsData() {
      // 只允许选择三级分类：
      // 通过数组的长度判断
      if (this.selectedCategoryKeys.length !== 3) {
        this.selectedCateKeys = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        this.$message({
          type: 'error',
          durattion: 1000,
          message: '仅允许为第三级分类设置相关参数, 请重新操作!',
        })
        this.selectedCategoryKeys = []
        return
      }

      // 选中的是第三级分类
      // 根据分类  id 和所处面板获取对应参数
      const { data: res } = await this.$http.get(`categories/${this.currentCategoryThreeId}/attributes`, {
        params: {
          sel: this.activeName,
        },
      })
      if (res.meta.status !== 200) {
        this.$message({
          type: 'error',
          durattion: 1000,
          message: '获取参数列表失败!',
        })
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      this.$message({
        type: 'success',
        durattion: 1000,
        message: '获取参数列表成功!',
      })
    },
    // 显示编辑对话框
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.currentCategoryThreeId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName },
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          durattion: 1000,
          message: '获取分类失败！',
        })
      }

      this.$message({
        type: 'success',
        durattion: 1000,
        message: '获取分类成功！',
      })
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          durattion: 1000,
          message: '已取消删除！',
        })
      }
      const { data: res } = await this.$http.delete(`categories/${this.currentCategoryThreeId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          durattion: 1000,
          message: '删除参数失败！',
        })
      }
      this.$message({
        type: 'success',
        durattion: 1000,
        message: '删除参数成功！',
      })
      this.getParamsData()
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.currentCategoryThreeId}/attributes`, {
          attr_name: this.addFrom.attr_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'error',
            durattion: 1000,
            message: '添加' + this.titleText + '失败!',
          })
        }
        this.$message({
          type: 'success',
          durattion: 1000,
          message: '添加' + this.titleText + '成功!',
        })
        this.addParamDialogVisible = false
        this.getParamsData()
      })
    },
    // 重置修改表单
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.currentCategoryThreeId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            durattion: 1000,
            message: '修改参数失败!',
          })
        }
        this.$message({
          type: 'success',
          durattion: 1000,
          message: '修改参数成功!',
        })
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 文本框失去焦点,或者按下 Enter 触发
    handleInputConfirm(row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.currentCategoryThreeId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          durattion: 1000,
          message: '修改参数项失败！',
        })
      }
      this.$message({
        type: 'success',
        durattion: 1000,
        message: '修改参数项成功！',
      })
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    // 按钮不显示 -> true, 否则返回 false
    isBtnDisable() {
      return this.selectedCategoryKeys.length !== 3
    },
    // 当前选中的第三级分类 id
    currentCategoryThreeId() {
      if (this.selectedCategoryKeys.length === 3) return this.selectedCategoryKeys[2]
      return null
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    },
  },
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
