import $axios from '../api.js'

const state = () => ({
    outlets: [], //untuk menampung data outlets yg didapat dari database

    outlet:{ //digunakan pada form add
        code: '',
        name: '',
        status: false,
        address: '',
        phone: ''
    },
    page: 1 //untuk mencatat page yg sedang di akses
})

const mutations = {
    //memasukan data ke state outlets
    ASSIGN_DATA(state, payload){
        state.outlets = payload
    },
    //mengubah data state ke page
    SET_PAGE(state, payload){
        state.page = payload
    },

    //mengubaha data state ke outlet
    ASSIGN_FORM(state, payload){
        state.outlet = {
            code: payload.code,
            name: payload.name,
            status: payload.status,
            address: payload.address,
            phone: payload.phone
        }
    },
    //mereset state outlet menjado kosong
    CLEAR_FORM(state){
        state.outlet = {
            code: '',
            name: '',
            status: false,
            address: '',
            phone: ''
        }
    }
}

const actions = {
    //untuk melakukan request data outlet dari server
    getOutlets({ commit, state }, payload){
        //mengecek payload ada atau tidak
        let search = typeof payload != 'undefined' ? payload: ''
        return new Promise((resolve, reject) => {
            $axios.get(`/outlets?page=${state.page}&q=${search}`)
            .then((response) => {
                //simpan data ke state melalui mutaion
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },

    //untuk menambahkan data baru
    submitOutlet({ dispatch, commit, state }){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server
            $axios.post(`/outlets`, state.outlet)
            .then((response) => {
                //apabila berhasil akan melakukan request lagi untuk mengamnil data terbaru
                dispatch('getOutlets').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //apabila terjadi error validasi
                if(error.response.status == 422){
                    //maka list error akan di assign ke state error
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },
    //untuk mengambil single data dari server berdasarkan code outlet
    editOutlet({ commit }, payload){
        return new Promise((resolve, reject) => {
            //melakukan request dengan mengirimkan code outlet di url
            $axios.get(`/outlets/${payload}/edit`)
            .then((response) => {
                //apabila berhasi di assign ke forrm
                commit('ASSIGN_FORM', response.data.data)
                resolve(response.data)
            })
        })
    },
    //untuk melakukan update data
    updateOutlet({ state, commit }, payload){
        return new Promise((resolve, reject) => {
            //mengirimkan request
            $axios.put(`/outlets/${payload}`, state.outlet)
            .then((response) => {
                //form dibersihkan
                commit('CLEAR_FORM')
                resolve(response.data)
            })
        })
    },
    //Menghapus data
    removeOutlet({ dispatch }, payload){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server untuk hapus data dengan method delete dan id outlet di url
            $axios.delete(`/outlets/${payload}`)
            .then((response) => {
                //apabila berhasi fetch data terbaru dari server
                dispatch('getOutlets').then(() => resolve())
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
