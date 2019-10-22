import Vue from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

import Permissions from './mixins/Permission.js'

import { mapActions, mapGetters, mapState } from 'vuex'

import Echo from 'laravel-echo'
import Pusher from "pusher-js"

import BootstrapVue from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'

import vSelect from 'vue-select'

Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.mixin(Permissions)
Vue.component('v-select', vSelect)

import 'bootstrap-vue/dist/bootstrap-vue.css'
import { type } from 'os'

new Vue({
    el: '#ar',
    router,
    store,
    components: {
        App
    },
    computed: {
        ...mapGetters(['isAuth']),
        ...mapState(['token']),
        ...mapState('user', {
            user_authenticated: state => state.authenticated //mengambil state user yg sedang login
        })
    },
    methods: {
        ...mapActions('user', ['getUserLogin']),
        ...mapActions('notification', ['getNotifications']), //mendefinisikan fungsi untuk mengambil notifikasi dari table notification
        ...mapActions('expenses', ['getExpenses']), //fungsi untuk mengambil expenses yg baru
        //method ini berfungsi untuk mengisiasi lister menggunakan laravel echp
        initialLister(){
            //jika user sudah login
            if(this.isAuth){
                //maka inisiasi fungsi broadcaster dengan konfigurasi seperti ini
                window.Echo = new Echo({
                    broadcaster: 'pusher',
                    key: process.env.MIX_PUSHER_APP_KEY, //value yg diambil dari file env
                    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                    encrypted: false,
                    auth: {
                        headers: {
                            Authorization: 'Bearer ' + this.token
                        },
                    },
                });

                if(typeof this.user_authenticated.id != 'undefined'){
                    //mengakses chanel broadcast secara private
                    window.Echo.private(`App.User.${this.user_authenticated.id}`) //diambil dari routes chanel.php
                    .notification(() => {
                        //apabila ditemukan maka akan mengambil dua fungsi ini untuk mengambil data terbaru
                        this.getNotifications()
                        this.getExpenses()
                    })
                }
            }
        }
    },
    watch: {
        //ketika value token berubah
        token(){
            this.initialLister() //jalankan fungsi untuk menginiasiasi
        },
        //ketika value user yg sedang login berubah
        user_authenticated(){
            this.initialLister() //dijalankan lagi
        }
    },
    created(){
        if(this.isAuth){
            this.getUserLogin() //request data yg sedang login
            this.initialLister()
            this.getNotifications()
        }
    }
})
