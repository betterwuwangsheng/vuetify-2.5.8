import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ 'components/Welcome')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/authority/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ 'components/authority/Roles')

const Categories = () => import(/* webpackChunkName: "Categories_Params_GoodsList */ 'components/goods/Categories')
const Params = () => import(/* webpackChunkName: "Categories_Params_GoodsList */ 'components/goods/Params')
const GoodsList = () => import(/* webpackChunkName: "Categories_Params_GoodsList */ 'components/goods/GoodsList')

const GoodsAdd = () => import(/* webpackChunkName: "GoodsAdd_GoodsOrders_Reports */ 'components/goods/GoodsAdd')
const GoodsOrders = () => import(/* webpackChunkName: "GoodsAdd_GoodsOrders_Reports */ 'components/goods/GoodsOrders')
const Reports = () => import(/* webpackChunkName: "GoodsAdd_GoodsOrders_Reports */ 'components/goods/Reports')

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
      { path: '/welcome', component: Welcome },
      // /users 子路由
      { path: '/users', component: Users },
      // /rights 子路由
      { path: '/rights', component: Rights },
      // /roles 子路由
      { path: '/roles', component: Roles },
      // /categories 子路由
      { path: '/categories', component: Categories },
      // /params 子路由
      { path: '/params', component: Params },
      // /params 子路由
      { path: '/params', component: Params },
      // /goods 子路由
      { path: '/goods', component: GoodsList },
      // /goods/add 子路由
      { path: '/goods/add', component: GoodsAdd },
      // /goods/add 子路由
      { path: '/orders', component: GoodsOrders },
      // /reports 子路由
      { path: '/reports', component: Reports },
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
