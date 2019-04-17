// 封装axios
import axios from 'axios';
import router from '../router/index';

//muse的toast插件
import Vue from 'vue'
import Toast from 'muse-ui-toast';
Vue.use(Toast);

axios.defaults.withCredentials=true;//让ajax携带cookie
//axios.defaults.baseURL = 'http://203.195.135.197:3000/' //设置访问基础路径
//请求拦截(配置发送请求的信息)
axios.interceptors.request.use(config => {
    if(localStorage.eleToken) {
        //设置统一的请求头 每次请求带着token过去
        config.headers.Authorization = localStorage.eleToken
    }
    return config
},error => {
    //请求失败的处理
    return Promise.reject(error)
})

//响应拦截(配置请求回来的信息)
axios.interceptors.response.use(response => {
    return response
},error => {
    Toast.error(error.response.data)

    //获取错误状态码
    const {status} = error.response
    if(status == 401) {
        Toast.error('登录信息失效,请重新登录')
        //清除token
        localStorage.removeItem('eleToken')
        //跳转到登录页面
        router.push('/login')
    }

    return Promise.reject(error)
})

export default function (url, data = {}, type = 'GET') {
    if (type === 'GET') {
    
      let paramStr = ''
      Object.keys(data).forEach(key => {
        paramStr += key + '=' + data[key] + '&'
      })
      if (paramStr) {
        paramStr = paramStr.substring(0, paramStr.length - 1)
      }
      return axios.get(url + '?' + paramStr)
    } else {
      return axios.post(url,data)
    }
  }
  
  