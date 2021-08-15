<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表展示区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统组件 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二,三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="320px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
              编辑
            </el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">
              删除
            </el-button>
            <el-button size="small" type="waring" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
        <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="editRoleFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形数据展示 -->
        <el-tree
          :data="rightsLsit"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Role',
  data() {
    return {
      // 所有角色列表的数据
      roleList: [],
      // 控制添加用户的对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 控制分配权限对话框的显示
      setRightDialogVisible: false,
      // 角色添加
      addRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      // 角色添加表单验证规则
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      // 编辑角色信息
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      // 所有权限数据
      rightsLsit: [],
      //树形控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的结点 id 值
      defaultKeys: [],
      // 当前即将分配权限的 id
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      // 发起请求
      const { data: res } = await this.$http.get('roles')
      // 失败
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          duration: 1000,
          message: '获取角色列表失败!',
        })
      }
      // 保存数据
      this.roleList = res.data

      // 成功
      this.$message({
        type: 'success',
        duration: 1000,
        message: '获取角色列表成功!',
      })
    },
    // 监听添加角色对话框的关闭事件
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async validate => {
        // 验证失败
        if (!validate) return

        // 成功
        const { data: res } = await this.$http.post('roles', this.addRoleForm)

        // 请求失败
        if (res.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: '添加角色失败!',
            duration: 1000,
          })
        }

        // 成功
        this.$message({
          type: 'success',
          message: '添加角色成功!',
          duration: 1000,
        })
        // 关闭对话框
        this.addRoleDialogVisible = false

        // 重新获取角色列表
        this.getRoleList()
      })
    },
    // 监听编辑角色对话框的关闭事件
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 展示编辑对话框
    async showEditDialog(id) {
      // 请求对应角色数据进行显示
      const { data: res } = await this.$http.get('roles/' + id)

      // 失败
      if (res.meta.status !== 200) return

      // 成功
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 编辑角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async validate => {
        // 表单预校验失败
        if (!validate) return
        const { data: res } = await this.$http.put('Role/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        })
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '更新角色信息失败！',
            duration: 1000,
          })
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false
        this.$message({
          type: 'success',
          duration: 1000,
          message: '更新角色信息成功！',
        })
        this.getRoleList()
      })
    },
    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          duration: 1000,
          message: '已取消删除!',
        })
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          message: '删除角色失败',
          duration: 1000,
        })
      this.$message({
        type: 'success',
        duration: 1000,
        message: '删除用户成功!',
      })
      this.getRoleList()
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消权限删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      role.children = res.data
      //   不建议使用
      // this.getRolesList()
    },
    // 展示权限分配的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'erroe',
          duration: 1000,
          message: '获取权限数据失败!',
        })
      }
      // 成功
      this.rightsLsit = res.data
      // 打开对话框s
      // 递归获取三级结点的 id
      this.getLeafKeys(role, this.defaultKeys)

      this.setRightDialogVisible = true
    },
    // 递归获取角色下所有三级权限项的 id， 保存至 defaultKey 数组
    getLeafKeys(node, arr) {
      // 不包含 children 属性
      if (!node.children) return arr.push(node.id)
      // 非叶结点
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defaultKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedNodes()]

      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200)
        return this.$message({
          type: 'error',
          duration: 1000,
          message: '分配权限失败!',
        })

      this.$message({
        type: 'success',
        duration: 1000,
        message: '分配权限成功!',
      })

      // 刷新
      this.getRoleList()
      this.setRightDialogVisible = false
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1xp solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
