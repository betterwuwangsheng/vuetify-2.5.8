import Vue from 'vue'

// 按需导入 element-ui 组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 全局挂载弹窗组件
// 设置全局变量
// 通过在原型上定义它们使其在每个 Vue 的实例中可用
// $message
Vue.prototype.$message = Message
