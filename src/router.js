import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "about" */ './views/Login.vue'),
            meta:{
                type:'login',
            }
        },
        {
            path: '/user/list',
            component: () => import(/* webpackChunkName: "about" */ './views/user/list.vue'),
        },
        {
            path: '/user/password',
            component: () => import(/* webpackChunkName: "about" */ './views/user/password.vue'),
        }
    ]
})
