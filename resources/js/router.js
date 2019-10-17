import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import store from './store.js'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { requireAuth: true }//menandakan proses membutuhkan otentikasi
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
});

//routing untuk ngecek otentikasi
router.beforeEach((to, from, next) =>{
    if(to.matched.some(record => record.meta.requireAuth)){
        let auth = store.getters.isAuth
        if(!auth){
            next({name : 'login'})
        }else{
            next()
        }
    }else{
        next()
    }
})

export default router
