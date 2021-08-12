import Vue from 'vue'

// 按需导入 element-ui 组件
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  MessageBox,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Loading,
  Tag,
  Tree,
  Select,
  Option,
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

// 全局挂载弹窗组件
// 设置全局变量
// 通过在原型上定义它们使其在每个 Vue 的实例中可用
// $message
// $confirm
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
