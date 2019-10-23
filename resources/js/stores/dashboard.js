import $axios from '../api.js'

const state = () => ({
    transactions: [], //state untuk menyimpan data transaksi
})

const mutations = {
    //mutation untuk memanipulasi data state transaksi
    ASSIGN_DATA_TRANSACTION(state, payload){
        state.transactions = payload
    }
}

const actions = {
    //action untuk menghandle request ke server
    getChartData({ commit }, payload){
        return new Promise((resolve, reject) => {
            //meminta data chart transaksi ke server berdasarkan bulan dan tahun
            $axios.get(`/chart?month=${payload.month}&year=${payload.year}`)
            .then((response) => {
                //kemudian kirim data ke mutation untuk kemudian disimpan di state
                commit('ASSIGN_DATA_TRANSACTION', response.data)
                resolve(response.data)
            })
        })
    },
}

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
