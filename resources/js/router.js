import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import store from './store.js'

import IndexOutlet from './pages/outlets/Index.vue'
import DataOutlet from './pages/outlets/Outlet.vue'
import AddOutlet from './pages/outlets/Add.vue'
import EditOutlet from './pages/outlets/Edit.vue'

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
        },
        {
            path: '/outlets',
            component: IndexOutlet,
            children: [
                {
                    path: '',
                    name: 'outlets.data',
                    component: DataOutlet,
                    meta: { title: 'Manage Outlets' }
                },
                {
                    path: 'add',
                    name: 'outlets.add',
                    component: AddOutlet,
                    meta: { title: 'Add New Outlet' }
                },
                {
                    path: 'edit/:id',
                    name: 'outlets.edit',
                    component: EditOutlet,
                    meta: { title: 'Edit Outlet' }
                }
            ]
        }
    ]
});

//routing untuk ngecek otentikasi
//jika sudah login maka lanjut ke home jika belum tetap di halaman login
router.beforeEach((to, from, next) =>{
    store.commit('CLEAR_ERRORS') //berfungsi untuk membersihkan state error setiap halaman di load
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
