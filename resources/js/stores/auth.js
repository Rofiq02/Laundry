import $axios from '../api.js'

const state = () => ({

})

const mutations = {

}

const actions = {
    submit({ commit }, payload){
        localStorage.setItem('token', null)// Reset Loacal storage menjadi null
        commit('set_token', null, { root: true }) //Reset State token menjadi null

        return new Promise((resolve, reject) => {
            //mengirim request ke server dengan login
            //data yang dikirimkan adalah payload
            $axios.post('/login', payload)
            .then((response) => {
                //jika responnya sukses
                if(response.data.status == 'success'){
                    //maka local storage dan state token akan di set menggunakan api dari server response
                    localStorage.setItem('token', response.data.isi)
                    commit('set_token', response.data.isi, { root: true })
                }else{
                    commit('set_errors', { invalid: 'Email/Password Salah' }, { root:true })
                }

                resolve(response.data)//kegunaan resolve diakhir agar dianggap proses selesai
            })
            .catch((error) =>{
                if(error.response.status == 422){
                    commit('set_errors', error.response.data.errors, { root:true })
                }
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
