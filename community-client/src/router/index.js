import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Chat from '../views/Chat'
import Message from '../views/Message'
import Me from '../views/Me'
import UserInfo from '../views/UserInfo'
import UserAvatar from '../views/UserAvatar'
import Login from '../views/Login'
import Register from '../views/Register'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/chat/:id/:name',
      name: 'chat',
      component: Chat,
      meta: { hiddenNav: true }
    },
    {
      path: '/message',
      name: 'message',
      component: Message
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: UserInfo,
      meta: { hiddenNav: true }
    },
    {
      path: '/useravatar',
      name: 'useravatar',
      component: UserAvatar,
      meta: { hiddenNav: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { hiddenNav: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { hiddenNav: true }
    },
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false
  //登录和注册页面随时可以进去
  if (to.path == '/login' || to.path == '/register') {
    next()
  } else {
    //token不存在时不能进入主页面，去登录页面
    isLogin ? next() : next('/login')
  }
})


export default router;