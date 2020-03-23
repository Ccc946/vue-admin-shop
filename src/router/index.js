import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

// 路由懒加载
const Home = () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
const Login = () => import(/* webpackChunkName: "login" */ '../views/login.vue')
const HomeInfo = () => import(/* webpackChunkName: "login" */ '../components/HomeInfo.vue')
const User = () => import(/* webpackChunkName: "login" */ '../components/User.vue')
const Roles = () => import(/* webpackChunkName: "login" */ '../components/Roles.vue')
const Rights = () => import(/* webpackChunkName: "login" */ '../components/Rights.vue')
const Reports = () => import(/* webpackChunkName: "login" */ '../components/Reports.vue')
const Params = () => import(/* webpackChunkName: "login" */ '../components/Params.vue')
const Orders = () => import(/* webpackChunkName: "login" */ '../components/Orders.vue')
const Goods = () => import(/* webpackChunkName: "login" */ '../components/Goods.vue')
const Categories = () => import(/* webpackChunkName: "login" */ '../components/Categories.vue')
const Add = () => import(/* webpackChunkName: "login" */ '../components/Add.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',name: 'Login',component: Login},
  { path: '/home',name: 'Home',component: Home, redirect:'/homeInfo',
    children:[
      { path: '/homeInfo', component : HomeInfo },
      { path: '/users', component : User },
      { path: '/roles', component : Roles },
      { path: '/rights', component : Rights },
      { path: '/reports', component : Reports },
      { path: '/params', component : Params },
      { path: '/orders', component : Orders },
      { path: '/goods', component : Goods },
      { path: '/goods/add', component: Add },
      { path: '/categories', component : Categories },
    ]
},
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token');
  if(to.path !== '/login')
  {
    if(!token) {
      next('/login');
    }
  }
  next();
})

export default router
