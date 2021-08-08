<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示数据 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <!-- 状态渲染为按钮 -->
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              effect="dark"
              content="编辑角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="small"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 保存按钮 -->
            <el-tooltip
              effect="dark"
              content="删除角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="editUserForm"
          :rules="editUserFormRules"
          ref="editUserFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="editUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Users',
  data() {
    // 自定义邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        query: '',
        // 页号
        pagenum: 1,
        // 页大小
        pagesize: 20,
      },
      // 用户列表
      userList: [],
      // 总数据条数
      total: 0,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      // 用户添加
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 用户添加表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用户名的长度在 2 ～ 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '用户密码的长度在 6 ～ 18 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 控制修改用户的对话框的显示与隐藏
      editDialogVisible: false,
      // 根据 id 查询到的用户信息
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 当前需要被分配角色的用户
      userInfo: {},
      // 所有角色数据列表
      rolesLsit: [],
      // 已选中的角色Id值
      selectRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 简化 promise 操作
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          duration: 1000,
          message: '获取用户数据失败!',
        })
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // 更新页大小(每一页显示的数量)
      this.queryInfo.pagesize = newSize
      // 请求数据
      this.getUserList()
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // 更新页码(新的一页)
      this.queryInfo.pagenum = newPage
      // 请求数据
      this.getUserList()
    },

    // 监听 switch 开关状态的改变
    async userStateChanged(userInfo) {
      // 保存用户最新状态
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message({
          type: 'error',
          message: '更新用户状态失败!',
          duration: 1000,
        })
      }
      // 成功
      return this.$message({
        type: 'success',
        message: '更新用户状态成功',
        duration: 1000,
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      // 预校验
      this.$refs.addUserFormRef.validate(async validate => {
        // 校验失败
        if (!validate) return

        // 校验成功 -> 发起请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          this.$message({
            type: 'error',
            duration: 1000,
            message: '添加用户失败!',
          })
        }
        this.$message({
          type: 'success',
          duration: 1000,
          message: '添加用户成功!',
        })

        // 隐藏添加用户的对话框
        this.addDialogVisible = false

        // 刷新用户数据列表
        this.getUserList()
      })
    },
    // 显示编辑用户的对话框
    async showEditDialog(id) {
      // 根据 id 请求数据
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message({
          type: 'error',
          duration: 1000,
          message: '查询用户信息失败!',
        })
      }
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser() {
      this.$refs.editUserFormRef.validate(async validate => {
        // 预校验不通过
        if (!validate) return

        // 预校验通过 -> 发起请求
        const { data: res } = await this.$http.post(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        )
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            duration: 1000,
            message: '更新用户信息失败!',
          })
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据
        this.getUserList()
        // 提示修改成功
        this.$message({
          type: 'success',
          duration: 1000,
          message: '更新用户信息成功!',
        })
      })
    },
    // 根据 id 删除用户
    async removeUserById(id) {
      // 弹框询问用户是否删除信息
      const confirmResult = await this.$confirm(
        '即将永久删除用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(error => {
        return error
      })

      // 用户取消删除, 返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          duration: 1000,
          message: '已取消删除',
        })
      }
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 发起请求
      const { data: res } = await this.$http.delete('users/' + id)

      //失败
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: '删除用户信息失败!',
        })
      }

      // 成功
      this.$message({
        type: 'success',
        duration: 1000,
        message: '删除用户信息成功!',
      })

      // 刷新
      this.getUserList()
    },
  },
}
</script>
<style lang="less" scoped></style>
