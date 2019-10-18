import Vue from 'vue'
import Vuex from 'vuex'

import auth from './stores/auth.js'
import outlet from './stores/outlet.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    //menetapkan module
    modules: {
        auth,
        outlet
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
        SET_TOKEN(state, payload){
            state.token = payload
        },
        SET_ERRORS(state, payload){
            state.erros = payload
        },
        CLEAR_ERRORS(state){
            state.errors = []
        }
    }
})

export default store
