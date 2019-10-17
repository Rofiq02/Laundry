<template>
    <div class="container">
        <div class="login-box">
            <div class="login-logo">
                <router-link :to="{ name: 'home' }"><b>Laundry</b></router-link>
            </div>
            <div class="login-box-body">
                <p class="login-box-msg">Login</p>
                <div class="form-group has-feedback" :class="{'has-error': errors.email}">
                    <input type="email" class="form-control" placeholder="Email" v-model="isi.email">
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    <p class="text-danger" v-if="errors.email">{{ errors.email[0] }}</p>
                </div>
                <div class="form-group has-feedback" :class="{'has-error': errors.password}">
                    <input type="password" class="form-control" placeholder="Password" v-model="isi.password">
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    <p class="text-danger" v-if="errors.password">{{ errors.password[0] }}</p>
                </div>
                <div class="alert alert-danger" v-if="errors.invalid">{{ errors.invalid }}</div>
                <div class="row">
                    <div class="col-xs-8">
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" v-model="data.remember_me"> Remember Me
                            </label>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <button type="submit" class="btn btn-primary btn-block btn-flat" @click.prevent="postLogin">Login</button>
                    </div>
                </div>

                <a href="#">Lupa Password?</a><br>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';
export default {
    data(){
        return {
            isi:{
                email: '',
                password: '',
                remember_me: false
            }
        }
    },
    //Sebelum component melakukan render
    created(){
        //di cek terlebih dahulu
        if(this.isAuth){
            //jika iya akan melakukan direct ke route dengan name home
            this.$router.push({ name : 'hoem'})
        }
    },
    computed: {
        ...mapGetters(['isAuth']), //mengambil getters isAuth dari vuex
        ...mapState(['errors'])
    },
    methods:{
        ...mapActions('auth', ['submit']), //menjalankan fungsi submit agar dapat digunakan pada componentnya
        ...mapMutations(['clear_errors']),

        //fungsi untuk login
        postLogin(){
            this.submit(this.isi).then(() =>{
                //mengecek isi value
                if(this.isAuth){
                    this.clear_errors()
                    //lalu direct
                    this.$router.push({ name: 'home'})
                }
            })
        }
    }
}
</script>
