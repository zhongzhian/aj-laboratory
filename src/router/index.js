import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers, commonRouters, appRouter } from './defines'
import iView from 'iview'
import store from '../store'
import Cookie from 'js-cookie'

Vue.use(VueRouter)

const RouterConfig = {
  // mode: 'history',
  routes: routers
}
const router = new VueRouter(RouterConfig)

//根据路由解析出菜单
store.commit('SET_APP_MENUS', appRouter.children)

// const token = store.getters.token
// if (token) { //假如有token，则根据token去取账号，否则跳到登录页面
//   store.dispatch('fetchAccount')
// }

const whiteList = ['login', 'register', 'error-403', 'error-404', 'error-500', 'home-index', 'home-search', 'home-course', 'home-teachers', 'home-network'];// 不重定向白名单

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // next()
  const token = Cookie.get('app_token')
  const isAdmin = Cookie.get('app_isAdmin')
  const authMenus = Cookie.get('auth_menus')
  console.log("to", to);
  if (whiteList.indexOf(to.name) > -1) {
    next()
  } else {
    let returnPath = "?name=" + to.name;
    if (token && token != 'undefined') {
      if (to.path === '/login') {
        next('/')
      } else {
        next()
        // if(isAdmin == 1 || authMenus.indexOf(to.name) > -1) {
        //   next()
        // } else { //没权限，禁止访问
        //   next('/403')
        // }
      }
    } else {
      next('/login' + returnPath) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  iView.LoadingBar.finish();
  // window.scrollTo(0, 0);
});

export default router