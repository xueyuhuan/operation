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
            path: '/output/list',
            component: () => import(/* webpackChunkName: "about" */ './views/output/list.vue'),
        },
        {
            path: '/add/list',
            component: () => import(/* webpackChunkName: "about" */ './views/add/list.vue'),
        },
        {
            path: '/user/password',
            component: () => import(/* webpackChunkName: "about" */ './views/user/password.vue'),
        },
        {
            path: '/shop/list',
            component: () => import(/* webpackChunkName: "about" */ './views/shop/list.vue'),
        },
        {
            path: '/shop/return/rate',
            component: () => import(/* webpackChunkName: "about" */ './views/shop/return-rate.vue'),
        },
        {
            path: '/return/list',
            component: () => import(/* webpackChunkName: "about" */ './views/return/list.vue'),
        },
        {
            path: '/money/list',
            component: () => import(/* webpackChunkName: "about" */ './views/money/list.vue'),
        },
    ]
})
