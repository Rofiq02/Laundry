import Vue from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

import Permissions from './mixins/Permission.js'

import { mapActions, mapGetters } from 'vuex'

import BootstrapVue from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'

Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.mixin(Permissions)

import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
    el: '#ar',
    router,
    store,
    components: {
        App
    },
    computed: {
        ...mapGetters(['isAuth'])
    },
    methods: {
        ...mapActions('user', ['getUserLogin'])
    },
    created(){
        if(this.isAuth){
            this.getUserLogin() //request data yg sedang login
        }
    }
})
