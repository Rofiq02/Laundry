import $axios from '../api.js'

const state = () => ({

})

const mutations = {

}

const actions = {
    submit({ commit }, payload){
        localStorage.setItem('token', null)// Reset Loacal storage menjadi null
        commit('SET_TOKEN', null, { root: true }) //Reset State token menjadi null. alasan dikasih roo true karena mutation set_token berada pada root stores makan ditambhkan root true

        //fungsi dari promise adalah agar fungsi yg dijalankan selanjutnya berjalan ketika fungsi promise selesai
        return new Promise((resolve, reject) => {
            //mengirim request ke server dengan login
            //data yang dikirimkan adalah payload
          $axios.post('/login', payload)
            .then((response) => {
                //jika responnya sukses
                if(response.data.status == 'success'){
                    //maka local storage dan state token akan di set menggunakan api dari server response
                    localStorage.setItem('token', response.data.data)
                    commit('SET_TOKEN', response.data.data, { root: true })
                }else{
                    commit('SET_ERRORS', { invalid: 'Email/Password Salah' }, { root:true })
                    // alert('error');
                }

                resolve(response.data)//kegunaan resolve diakhir agar dianggap proses selesai
            })
            .catch((error) =>{
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, { root:true })
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
