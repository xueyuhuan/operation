import Vue from "vue";
import axios from 'axios';

import qs from 'querystring'
import store from './store'
import router from "./router";

const instance=axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    // transformRequest: [function (data) {
    //     return qs.stringify(data);
    // }],
});
let loading;
//请求拦截器
instance.interceptors.request.use(
    config => {
        //在发送请求之前做些什么
        loading=Vue.prototype.$loading({text:"",background: 'rgba(0, 0, 0, 0.3)'});
        if(config.headers['Content-Type']==='application/x-www-form-urlencoded'){
            config.data=qs.stringify(config.data);
        }
        if(store.state.token!==''){
            config.headers.Authorization=store.state.token;
        }
        else if(localStorage.getItem('token')){
            store.commit('setData',{
                name:'token',
                value:localStorage.getItem('token')
            });
            store.commit('setData',{
                name:'user',
                value:qs.parse(localStorage.getItem('token'))
            });
            config.headers.Authorization= localStorage.getItem('token');
        }
        return config;
    },
    error => {
        //对错误请求做些什么
        loading=Vue.prototype.$loading({text:"",background: 'rgba(0, 0, 0, 0.3)'});
        Vue.prototype.$message.info('加载超时');
        return Promise.reject(error);
    });
//响应拦截器（返回状态判断）
instance.interceptors.response.use(
    res => {
        loading.close();
        if(res.data.message==='未登录,认证失败'){
            router.push({path: '/login'});
            return false
        }
        if(res.data.success !=="0000") {
            Vue.prototype.$message.error(res.data.message);
        }
        return res.data;
    },
    err => {
        loading.close();
        if (err.response) {
            // switch (err.response.status) {
            //     case 403:
            //         router.replace({
            //             path: '/loading',
            //             query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
            //         });
            // }
        }
        return Promise.reject(err)
    });
export default instance;