import $axios from '../api.js'

const state = () => ({
    users: [], //menampung list user
    roles: [], //menampung list role
    permissions: [], //menampung list permission
    role_permission: [], //menampung permission yg dimiliki oleh role
    authenticated: [] //menampung user yg sedang login
})

const mutations = {
    ASSIGN_USER(state, payload){
        state.users = payload
    },
    ASSIGN_ROLES(state, payload){
        state.roles = payload
    },
    ASSIGN_PERMISSION(state, payload){
        state.permissions = payload
    },
    ASSIGN_ROLE_PERMISSION(state, payload){
        state.role_permission = payload
    },
    CLEAR_ROLE_PERMISSION(state, payload){
        state.role_permission = []
    },
    ASSIGN_USER_AUTH(state, payload){
        state.authenticated = payload
    }
}

const actions = {
    //untuk mengambil data user
    getUserLists({ commit }){
        return new Promise((resolve, reject) => {
            $axios.get(`/user-lists`)
            .then((response) => {
                //simpan datanya ke state users menggunakan mutation
                commit('ASSIGN_USER', response.data.data)
                resolve(response.data)
            })
        })
    },
    //Fungsi ini untuk mengatur role tiap user
    setRoleUser({ commit }, payload) {
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', { root: true }) //state error dibersihgkan
            //mengirim permintaan ke back end
            $axios.post(`/set-role-user`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //apabia terjadi error validasi, set errornya agar ditampilkan
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, { root:true })
                }
            })
        })
    },
    //untuk mengambil list roles
    getRoles({ commit }){
        return new Promise((resolve, reject) => {
            //kirim permintaan ke back end
            $axios.get(`/roles`)
            .then((response) => {
                //simpan datanya ke dalam state roles
                commit('ASSIGN_ROLES', response.data.data)
                resolve(response.data)
            })
        })
    },
    //mengamnil list permission
    getAllPermission({ commit }){
        return new Promise((resolve, reject) => {
            //kirim permintaan ke back end
            $axios.get(`/permissions`)
            .then((response) => {
                //menyimoan data yg diterima ke dalam state permission
                commit('ASSIGN_PERMISSION', response.data.data)
                resolve(response.data)
            })
        })
    },
    //mengambil permission yg telah dimiliki oleh role tertentu
    getRolePermission({ commit }, payload){
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', { root:true }) //membersihkan state error
            $axios.post(`/role-permission`, { role_id: payload })
            .then((response) => {
                //simpan datanya dengan mutations
                commit('ASSIGN_ROLE_PERMISSION', response.data.data)
                resolve(response.data)
            })
        })
    },
    //berfungsi untuk mengatur permission setiap oleh yg dipilih
    setRolePermission({ commit },payload){
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', { root:true })
            //kirim permintaan ke backend
            $axios.post(`/set-role-permission`, payload)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                //apabila terjadi error validasi
                if(error.response.status == 422){
                    //set errornya agar dapat ditampilkan
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
            })
        })
    },

    //mengambil data user yg sedang login
    getUserLogin({ commit }){
        return new Promise((resolve, reject) => {
            $axios.get(`user-authenticated`)
            .then((response) => {
                //simpan data user tersebut
                commit('ASSIGN_USER_AUTH', response.data.data)
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
