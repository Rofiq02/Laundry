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
    }
}

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
