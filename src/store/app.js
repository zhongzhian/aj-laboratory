import jsSHA from 'jssha';
import router from '../router'
import axios from '../utils/http'
import qs from 'qs'
import API from '../api'
import Cookie from 'js-cookie'

const GetQueryString = (name,fullpath) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let paramspath = fullpath.split("?")[1];
  var r = null;
  if(paramspath){
    var r = paramspath.match(reg);
  }
  if (r != null) return unescape(r[2]); return null;
}
const app = {
  state: {
    token: Cookie.get('app_token'),
    isAdmin: Cookie.get('app_isAdmin'),
    appMenus: Cookie.get('app_menus'),
    authMenus: Cookie.get('auth_menus'),
    user: Cookie.getJSON('app_user'),
    loginLoading: false,
    loginMsg: '',
    themeSwitch: true,
  },
  mutations: {
    SET_TOKEN: (state, payload) => state.token = payload,
    SET_USER: (state, payload) => state.user = payload,
    SET_APP_MENUS: (state, payload) => state.appMenus = payload,
    SET_AUTH_MENUS: (state, payload) => state.authMenus = payload,
    SET_LOGIN_LOADING: (state, payload) => state.loginLoading = payload,
    SET_LOGIN_MSG: (state, payload) => state.loginMsg = payload,
    REMOVE_MSG: (state, payload) => state.loginMsg = payload,
    SET_THEME: (state, payload) => state.themeSwitch = payload,
    SET_IS_ADMIN: (state, payload) => state.isAdmin = payload,
  },
  actions: {
    fetchToken({ commit, dispatch }, payload) {
      const shaObj = new jsSHA('SHA-1', 'TEXT')
      shaObj.update(payload.password)
      const para = {
        ...payload,
        password: shaObj.getHash('HEX'),
        scope: 'ui',
        grant_type: 'password',
        client_id: 'browser'
      }

      commit('SET_LOGIN_LOADING', true)
      axios({
        method: 'post',
        url: API.login.token,
        data: qs.stringify(para),
        showSpin: false,
      }).then(response => {
        console.log("token response", response);
        commit('SET_TOKEN', response.result.token)
        Cookie.set('app_token', response.result.token)
        dispatch('fetchAccount')
        commit('SET_LOGIN_MSG', '')
      }).catch(err => {
        commit('SET_LOGIN_LOADING', false)
        if (err.response) {
          if (err.response.status === 500) {
            commit('SET_LOGIN_MSG', '验证服务连接失败！')
          } else {
            commit('SET_LOGIN_MSG', '账号和密码不匹配！')
          }
        } else {
          commit('SET_LOGIN_MSG', '验证失败！')
        }
      })
    },

    fetchAccount({ commit, dispatch, state }) {
      commit('SET_LOGIN_LOADING', true)
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: API.login.account,
          showSpin: false,
        }).then(response => {
          console.log("fetchAccount response", response);
          commit('SET_LOGIN_LOADING', false)
          commit('SET_USER', response.result)
          Cookie.set('app_user', response.result)
          // const menus = _.map(response.urlauthorityList, 'authorityName')
          // commit('SET_AUTH_MENUS', menus)
          // Cookie.set('auth_menus', menus)
          const isAdmin = response.result.userName === 'admin' ? 1 : 0
          commit('SET_IS_ADMIN', isAdmin)
          Cookie.set('app_isAdmin', isAdmin)
          // Cookie.set('app_userType', response.result.userType)

          // console.log("fetchAccount router", router);
          // console.log("router.currentRoute", router.currentRoute);
          if (router.currentRoute.path === '/login' || router.currentRoute.path === '/register') {
            let name = GetQueryString('name',router.currentRoute.fullPath);
            // console.log("name", name);
            if (name) {
              router.push({ name: name })
            } else {
              router.push('/')
            }
          }
          resolve(response.result)
        }).catch(err => {
          commit('SET_LOGIN_LOADING', false)
          Cookie.remove('app_token')
          router.push('/login')
          reject(err)
        })
      })
    },

    register({ commit, dispatch }, payload) {
      const shaObj = new jsSHA('SHA-1', 'TEXT')
      let pppassword = payload.password + "";
      shaObj.update(payload.password)
      payload.password = shaObj.getHash('HEX');
      commit('SET_LOGIN_LOADING', true)
      axios({
        method: 'post',
        url: API.login.register,
        data: payload,
        showSpin: false,
      }).then(response => {
        let paras = { username: payload.userName, password: pppassword };
        dispatch('fetchToken', paras)
        // if (response.code === 20000) {
        //   let paras = { username: payload.userName, password: pppassword };
        //   dispatch('fetchToken', paras)
        // }

        // commit('SET_LOGIN_LOADING', false)
        // commit('SET_USER', response.result)
        // const isAdmin = response.result.userName === 'admin' ? 1 : 0
        // commit('SET_IS_ADMIN', isAdmin)
        // Cookie.set('app_isAdmin', isAdmin)
        // if (router.currentRoute.path === '/register') {
        //   router.push('/home')
        // }
      }).catch(err => {
        commit('SET_LOGIN_LOADING', false)
        Cookie.remove('app_token')
        router.push('/login')
      })
    },
    logout({ commit, state }) {
      Cookie.remove('app_token')
      Cookie.remove('app_isAdmin')
      Cookie.remove('auth_menus')
      Cookie.remove('app_user')
      commit('SET_TOKEN', '')
      commit('SET_IS_ADMIN', '')
      commit('SET_USER', '')
      router.push('/login')
    },
    removeMsg({ commit }, payload) {
      commit('REMOVE_MSG', payload)
    },
  }
};

export default app;
