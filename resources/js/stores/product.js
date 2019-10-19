import $axios from '../api.js'

const state = () => ({
    products: [], //state yg akan menyimpan product
    page: 1,
    laundry_types: []
})

const mutations = {
    //mutation untuk memasukkan data ke dalam state products
    ASSIGN_DATA(state, payload){
        state.products = payload
    },
    //mutation untuk mengubah value dari state page
    SET_PAGE(state, payload){
        state.page = payload
    },
    ASSIGN_LAUNDRY_TYPE(state, payload){
        state.laundry_types = payload
    }
}

const actions = {
    //fungsi untuk mengamnil data ke server
    getProducts({ commit, state }, payload){
        let search = typeof payload != 'undefined' ? payload: ''
        return new Promise((resolve, reject) => {
            $axios.get(`/product?page=${state.page}$q=${search}`)
            .then((response) => {
                //apabila mendapatkan response data akan di commit ke mutation assign data
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    getLaundryType({ commit }){
        return new Promise((resolve, reject) => {
            //mengirim request untuk mengamnil data laundry
            $axios.get(`/product/laundry-type`)
            .then((response) => {
                commit('ASSIGN_LAUNDRY_TYPE', response.data.data) //commit data ke mutations assi gn laundry type
                resolve(response.data)
            })
        })
    },
    addLaundryType({ commit }, payload){
        return new Promise((resolve, reject) => {
            //mengirim request untuk menyimpan laundry type yg baru
            $axios.post(`/product/laundry-type`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
        .catch((error) => {
            //jika terjadi error validasi
            if(error.response.status == 422){
                commit('SET_ERRORS', error.response.data.errors, { root: true })
            }
        })
    },
    addProductLaundry({ commit }, payload){
        return new Promise((resolve, reject) => {
            $axios.post(`/product`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
        .catch((error) => {
            if(error.response.status == 422){
                commit('SET_ERRORS', error.response.data.errors, { root: true })
            }
        })
    },
    editProduct({ commit }, payload){
        return new Promise((resolve, reject) => {
            $axios.get(`/product/${payload}/edit`)
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    updateProduct({ commit }, payload){
        return new Promise((resolve, reject) => {
            $axios.put(`/product/${payload.id}`,payload)
            .then((response) =>{
                resolve(response.data)
            })
            .catch((error) => {
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    removeProduct({ dispatch }, payload){
        return new Promise((resolve, reject) => {
            $axios.delete(`/product/${payload}`)
            .then((response) => {
                dispatch('getProducts').then(() => resolve(response.data))
            })
        })
    }
}

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
