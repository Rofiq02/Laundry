import $axios from '../api.js'

const state = () => ({
    customers: [], //untuk menampung data customer

    //state untuk form add dan edit
    customer: {
        nik: '',
        name: '',
        address: '',
        phone: ''
    },
    page: 1
})

const mutations = {
    //mutation untuk assign data customer ke dalam state customer
    ASSIGN_DATA(state, payload){
        state.customers = payload
    },
    //mengubah state page
    SET_PAGE(state, payload){
        state.page = payload
    },
    //mengubah state customer
    ASSIGN_FORM(state, payload){
        state.customer = payload
    },
    //reset state customer
    CLEAR_FORM(state){
        state.customer = {
            nik: '',
            name: '',
            address: '',
            phone: ''
        }
    }
}

const actions = {
    getCustomers({ commit, state }, payload){
        let search = typeof payload != 'undefined' ? payload: ''
        return new Promise((resolve, reject) => {
            //request data ke customer dengan mengirimkan parameter page yg sedang aktif dan value pencarian
            $axios.get(`/customer?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data) //jika data diterima akan disimpan ke dalam mutations
                resolve(response.data)
            })
        })
    },
    submitCustomer({ dispatch, commit, state }){
        return new Promise((resolve, reject) => {
            //mengirim request ke backend dengan data yg didapatkan dari state customer
            $axios.post(`/customer`, state.customer)
            .then((response) => {
                //apabila berhasi maka load data customer untuk mengambil data terbaru
                dispatch('getCustomers').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //jika terjadi error validasi, assign error ke dalam state error
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, { root:true })
                }
            })
        })
    },
    editCustomer({ commit }, payload){
        return new Promise((resolve, reject) => {
            $axios.get(`/customer/${payload}/edit`)// kirim permintaan ke server untuk mengambil single data customer berdasarkan payload (id)
            .then((response) => {
                commit('ASSIGN_FORM', response.data.data) //assign data tersebut ke dalam state customer
                resolve(response.data)
            })
        })
    },
    updateCustomer({ state, commit }, payload){
        return new Promise((resolve, reject) => {
            $axios.put(`/customer/${payload}`, state.customer) //mengirim permintaan ke server
            .then((response) => {
                commit('CLEAR_FORM') //bersihkan form
                resolve(response.data)
            })
        })
    },

    removeCustomer({ dispatch }, payload){
        return new Promise((resolve, reject) => {
            $axios.delete(`/customer/${payload}`) //mengirim request ke server berdasarkan payload(id)
            .then((response) => {
                dispatch('getCustomers').then(() => resolve()) //mengambil data customer terbaru
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
