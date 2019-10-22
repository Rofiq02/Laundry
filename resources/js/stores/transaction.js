import $axios from '../api.js'
import { deflateRaw } from 'zlib'

const state = () => ({
    customers: [], //untuk menampung data customer yg direquest
    products: [], //untuk menampung data product yg direquest
    page: 1
})

const mutations = {
    //mengubah state customer berdasarkan data yg diterima
    ASSIGN_DATA(state, payload){
        state.customers = payload
    },
    //mengubah state product berdasarkan data yg diterima
    DATA_PRODUCT(state, payload){
        state.products = payload
    },
    SET_PAGE(state, payload){
        state.page = payload
    }
}

const actions = {
    //mengirim permintaan ke server untuk mengambil data costumer berdasarkan keyword yg berada di dalam payload search
    getCustomers({ commit, state }, payload){
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/customer?page=${state.page}&q=${search}`)
            .then((response) => {
                //jika berhasil, simpan datanya ke state
                commit('ASSIGN_DATA', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },
    //mengirim permintaan ke server untuk mengambil data product
    getProducts({ commit,state }, payload){
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/product?page=${state.page}&q=${search}`)
            .then((response) => {
                //apabila berhasil, akan menyimpan ke state products
                commit('DATA_PRODUCT', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },
    //fungsi untuk membuat transaksi
    createTransaction({ commit }, payload){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server untuk membuat transaksi
            $axios.post(`/transaction`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
