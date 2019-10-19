import $axios from '../api.js'

const state = () => ({
    couriers: [], //untuk menampung data couriers
    page: 1, //page aktif
    id: '' //untuk edit data
})

const mutations = {
    //memasukan data yang diterima ke dala state courier
    ASSIGN_DATA(state, payload){
        state.couriers = payload
    },

    //mengubah state page
    SET_PAGE(state, payload){
        state.page = payload
    },

    //mengubah state ID
    SET_ID_UPDATE(state, payload){
        state.id = payload
    }
}

const actions = {
    //untuk melakukan request ke server untuk mengambil data
    getCouriers({ commit, state }, payload){
        let search = typeof payload != 'undefined' ? payload: ''
        return new Promise((resolve, reject) => {
            //menggunakan get
            $axios.get(`/couriers?page=${state.page}&q=${search}`)
            .then((response) => {
                //berfungsi untuk melakukan perubahan state
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    submitCourier({ dispatch, commit }, payload){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server dengan method post
            $axios.post(`/couriers`, payload, {
                //header ditambahkan karena ada file foto
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) =>{
                // ketikan berhasil maka dilakukan request untuk mengambil data kurir terbaru
                dispatch('getCouriers').then(() =>{
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //jika gagal validasi
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    editCourier({ commit }, payload){
        return new Promise((resolve, reject) => {
            //fungsi untuk melakukan request single data berdasarkan id kurir
            $axios.get(`/couriers/${payload}/edit`)
            .then((response) => {
                //Data yang diterima akan dikirim ke form
                resolve(response.data)
            })
        })
    },
    updateCourier({ state }, payload){
        return new Promise((resolve, reject) => {
            //fungsi untuk melakukan request dan perubahan data kurir berdasarkan state id kurir
            $axios.post(`/couriers/${state.id}`, payload, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            .then((response) => {
                resolve(response.data)
            })
        })
    },
    removeCourier({ dispatch }, payload){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server dengan method delete dan mengirimlan id yg akan dihapus
            $axios.delete(`/couriers/${payload}`)
            .then((response) => {
                //mengambil data terbaru dari server
                dispatch('getCouriers').then(() => resolve(response.data))
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
