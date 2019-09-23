import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
            meta:{
                type:'login',
            }
        },
        {
            path: '/user/list',
            component: () => import('./views/user/list.vue'),
        },
        {
            path: '/group/list',
            component: () => import('./views/group/list.vue'),
        },
        {
            path: '/output/list',
            component: () => import('./views/output/list.vue'),
        },
        {
            path: '/add/list',
            component: () => import('./views/add/list.vue'),
        },
        {
            path: '/user/password',
            component: () => import('./views/user/password.vue'),
        },
        {
            path: '/shop/list',
            component: () => import('./views/shop/list.vue'),
        },
        {
            path: '/shop/return/rate',
            component: () => import('./views/shop/return-rate.vue'),
        },
        {
            path: '/return/list',
            component: () => import('./views/return/list.vue'),
        },
        {
            path: '/money/list',
            component: () => import('./views/money/list.vue'),
        },
    ]
})
