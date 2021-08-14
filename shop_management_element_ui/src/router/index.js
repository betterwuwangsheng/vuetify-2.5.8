import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from 'components/Login'
import Home from 'components/Home'
import Welcome from 'components/Welcome'
import Users from 'components/user/Users'
import Rights from 'components/authority/Rights'
import Roles from 'components/authority/Roles'
import Categories from 'components/goods/Categories'
import Params from 'components/goods/Params'

const routes = [
  // 默认路由 -> 路由重定向
  { path: '/', redirect: '/login' },
  // /login 路由
  { path: '/login', component: Login },

  // /home 路由
  {
    path: '/home',
    component: Home,
    // 重定向到 /welcome
    redirect: '/welcome',
    children: [
      // /welcome 子路由
      {
        path: '/welcome',
        component: Welcome,
      },
      // /users 子路由
      {
        path: '/users',
        component: Users,
      },
      // /rights 子路由
      {
        path: '/rights',
        component: Rights,
      },
      // /roles 子路由
      {
        path: '/roles',
        component: Roles,
      },
      // /categories 子路由
      {
        path: '/categories',
        component: Categories,
      },
      // /params 子路由
      {
        path: '/params',
        component: Params,
      },
    ],
  },
]

const router = new VueRouter({
  routes,

  // history 模式
  mode: 'history',
})

// 挂载路由导航守卫
// 为路由兑现添加 beforeEach 导航守卫
// 实现无 token 不显示 Home 页面
// to 表示将要访问的路径
// from 表示从哪里来
// next 是下一个要做的操作 next('/login') 强制跳转 login
router.beforeEach((to, from, next) => {
  // 用户访问登录页面
  if (to.path === '/login') return next()

  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')

  // 没有 token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
