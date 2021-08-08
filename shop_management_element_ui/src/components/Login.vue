<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avator_box">
        <img src="~assets/logo.png" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            type="primary"
            class="login"
            @click="login"
          >
            登录
          </el-button>
          <el-button type="info" class="reset" @click="resetLoginForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      // 全屏遮罩
      fullscreenLoading: false,
      // 登录表单的数据绑定对象
      loginForm: {
        // 用户名
        username: 'admin',
        // 密码
        password: '123456',
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮, 重置登录表单
    resetLoginForm() {
      // 通过 this.$refs.refname 获取对应标签
      this.$refs.loginFormRef.resetFields()
      this.$message({
        type: 'success',
        duration: 1000,
        message: '重置成功',
      })
    },
    // 登录
    login() {
      // 加载样式
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)',
      // })
      // setTimeout(() => {
      //   loading.close()
      // }, 1000)

      // 登录之前的验证
      this.$refs.loginFormRef.validate(async validate => {
        if (!validate) return

        this.fullscreenLoading = true
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 2000)

        const { data: result } = await this.$http.post('login', this.loginForm)
        // 登录失败
        if (result.meta.status !== 200) return this.$message.error('登录失败')
        // 使用弹窗组件
        this.$message({
          type: 'success',
          duration: 1000,
          message: '登录成功',
        })
        // 1、将登陆成功之后的 token , 保存到客户端的 sessionStorage(会话) 中; localStorage(持久) 中是持久化的保存
        //   1.1 项目中出现了登录之外的其他 API 接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在 sessionStorage 中
        window.sessionStorage.setItem('token', result.data.token)

        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2d85f0;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 320px;
  background-color: #fff;
  border-radius: 30px;

  // 绝对定位 -> 指定位置 -> 位移实现
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avator_box {
    height: 150px;
    width: 150px;

    // 边框线
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;

    // 绝对定位
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    // 阴影
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  // 绝对定位
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  // 弹性布局
  display: flex;
  // 居中对齐
  justify-content: center;
}
.iconfont {
  font-size: 20px;
}
</style>
