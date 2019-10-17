import Vue from 'vue'
import Vuex from 'vuex'

import auth from './stores/auth.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    //menetapkan module
    modules: {
        auth
    },
    state: {
        //token diambil dari local storage token
        toke: localStorage.getItem('token'),
        errors: []
    },
    getters: {
        //tujuan dibuatnya getters untuk mengetahul nilai tue/false dari kondisi state token
        isAuth: state =>{
            return state.token != "null" && state.token != null
        }
    },

    //mutation berfungsi untuk memanipulasi value dari state token
    mutations:{
        set_token(state, payload){
            state.token = payload
        },
        set_errors(state, payload){
            state.erros = payload
        },
        clear_errors(state){
            state.errors = []
        }
    }
})

export default store
