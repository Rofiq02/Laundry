<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.name }">
            <label for="">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="courier.name" :readonly="$route.name == 'couriers.edit'">
            <p class="text-danger" v-if="errors.name">{{ errors.name[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.email }">
            <label for="">Email</label>
            <input type="email" class="form-control" v-model="courier.email">
            <p class="text-danger" v-if="errors.email">{{ errors.email[0] }}</p>
        </div>
         <div class="form-group" :class="{ 'has-error': errors.password }">
            <label for="">Password</label>
            <input type="password" class="form-control" v-model="courier.password">
            <p class="text-danger" v-if="errors.password">{{ errors.password[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.outlet_id }">
            <label for="">Outlet</label>
            <select name="outlet_id" class="form-control" v-model="courier.outlet_id">
                <option value="">Pilih</option>
                <option v-for="(row, index) in outlets.data" :value="row.id" :key="index">{{ row.name }}</option>
            </select>
            <p class="text-danger" v-if="errors.outlet_id">{{ errors.outlet_id[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.photo }">
            <label for="">Foto</label>
            <input type="file" class="form-control" accept="image/*" @change="uploadImage($event)" id="file-input">
            <p class="text-warning">Mau ganti Foto</p>
            <p class="text-danger" v-if="errors.photo">{{ errors.photo[0] }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'FormCourier',
    created(){
        this.getOutlets() // Ketika halaman di load, fungsi ini untuk mengambil data outlets

        //Page Edit
        if(this.$route.name == 'couriers.edit'){
            //fungsi untuk mengambil data yang akan diedit dijalan kan berdasarkan id
            this.editCourier(this.$route.params.id).then((res) =>{
                //respom yang akan diteriman akan dimaksukkan ke dalam atrribut courier
                this.courier = {
                    name: res.data.name,
                    email: res.data.email,
                    password: '',
                    photo: '',
                    outlet_id: res.data.outlet_id
                }
            })
        }
    },
    data(){
        return {
            courier: {
                name: '',
                email: '',
                password: '',
                photo: '',
                outlet_id: ''
            }
        }
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('outlet', {
            outlets: state => state.outlets //mengambil data outlets
        })
    },
    methods: {
        ...mapActions('outlet', ['getOutlets']), //mendefinisikan fungsi outlets
        ...mapActions('courier', ['submitCourier', 'editCourier', 'updateCourier']), //mendefinisikan fungsi tersebut
        ...mapMutations('courier', ['SET_ID_UPDATE']), //memanggil mutation

        //ketikan terjadi kesalahan pada gambar maka akan di assign ke dalam courier photo
        uploadImage(event){
            this.courier.photo = event.target.files[0]
        },
        //ketikan tombol submit ditekan
        submit(){
            let form = new FormData()
            form.append('name', this.courier.name)
            form.append('email', this.courier.email)
            form.append('password', this.courier.password)
            form.append('outlet_id', this.courier.outlet_id)
            form.append('photo', this.courier.photo)

             //ketika halaman add kurir di akses
            if(this.$route.name == 'couriers.add'){
                //maka akan menjalankan fungsi submitCourier
                this.submitCourier(form).then(() =>{
                    //kemudian form di kosongkan
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }
                    //direct ke halaman list data courier
                    this.$router.push({ name: 'couriers.data' })
                })
                //jika yang diaksek halaman edit courier
            }else if(this.$route.name == 'couriers.edit'){
                //maka id nya di assign ke state id
                this.SET_ID_UPDATE(this.$route.params.id)
                //fung si update courier dijalankan
                this.updateCourier(form).then(() =>{
                    //kemudian form dikosongkan
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }
                    //di direct ke halaman list data courier
                    this.$router.push({ name: 'couriers.data' })
                })
            }
        }

    }
}
</script>
