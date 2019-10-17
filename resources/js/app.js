import Vue from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

new Vue({
    el: '#ar',
    router,
    store,
    components: {
        App
    }
})
