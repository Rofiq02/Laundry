<template>
    <div>
        <div class="form-group" :class="{ 'has-error':errors.name }">
            <label for="">Nama Item</label>
            <input type="text" class="form-control" v-model="product.name" placeholder="Kemeja">
            <p class="text-danger" v-if="errors.name">{{ errors.name[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error':errors.unit_type }">
            <label for="">Tipe</label>
            <select v-model="product.unit_type" class="form-control">
                <option value="">Pilih</option>
                <option value="Kilogram">Kilogram</option>
                <option value="Potong">Potong</option>
            </select>
            <p class="text-danger" v-if="errors.unit_type">{{ errors.unit_type[0] }}</p>
        </div>
        <div class="row">
            <div class="col-md-6">
                <!-- ketika tombol add new ditekan -->
                <div class="form-group" :class="{ 'has-error': errors.laundry_type }">
                    <label for="">Jenis Jasa <sup><a @click="showForm = true" href="javascript:void(0)" v-if="!showForm">Add New</a></sup></label>
                    <select v-model="product.laundry_type" class="form-control">
                        <option value="">Pilih</option>
                        <option v-for="(row, index) in laundry_types" :key="index" :value="row.id">{{ row.name }}</option>
                    </select>
                     <p class="text-danger" v-if="errors.laundry_type">{{ errors.laundry_type[0] }}</p>
                </div>
            </div>

            <!-- form untuk menampilkan jenis laundry -->
            <div class="col-md-6" v-if="showForm">
                <div class="form-group" :class="{ 'has-error': errors.name_laundry_type }">
                    <label for="">&nbsp;</label>
                    <div class="input-group">
                        <input type="text" placeholder="Cuci Kering + Setrika" v-model="laundry_type" class="form-control">
                        <a href="javascript:void(0)" class="input-group-addon btn btn-warning btn-sm" id="basic-addon2" @click="addNewLaundryType">Save</a>
                    </div>
                     <p class="text-danger" v-if=" errors.name_laundry_type">{{  errors.name_laundry_type[0] }}</p>
                </div>
            </div>

        </div>
        <div class="form-group" :class="{ 'has-error': errors.price }">
            <label for="">Harga</label>
            <input type="number" v-model="product.price" class="form-control">
            <p class="text-danger" v-if="errors.price">{{ errors.price[0] }}</p>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group" :class="{ 'has-error':errors.service }">
                    <label for="">Lama Pengerjaan</label>
                    <input type="number" class="form-control" v-model="product.service">
                    <p class="text-danger" v-if="errors.service">{{ errors.service[0] }}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group" :class="{ 'has-error': errors.service_type }">
                    <label for="">Satuan</label>
                    <select class="form-control" v-model="product.service_type">
                        <option value="">Pilih</option>
                        <option value="hari">Hari</option>
                        <option value="jam">Jam</option>
                    </select>
                    <p class="text-danger" v-if="errors.service_type">{{ errors.service_type[0] }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'FormProduct',
    created(){
        this.getLaundryType() //method yg dijalankan

        //apabila mengaksesya dari route edit
        if(this.$route.name == 'products.edit'){
            //maka fungsi untuk mengambil data product berdasarkan id
            this.editProduct(this.$route.params.id).then((res) => {
                //variable yg ada diisi dengan data dari server
                this.product = {
                    name: res.data.name,
                    unit_type: res.data.unit_type,
                    price: res.data.price,
                    laundry_type: res.data.laundry_type_id,
                    service: res.data.service,
                    service_type: res.data.service_type
                }
            })
        }
    },
    data(){
        return {
            //definisikan variable
            product: {
                name: '',
                unit_type: '',
                price: '',
                laundry_type: '',
                service: '',
                service_type: ''
            },
            laundry_type: '',
            showForm: false //default form untuk menambahkan jenis laundry
        }
    },
    computed: {
        ...mapState(['errors']), //mengambil state error
        ...mapState('product', {
            laundry_types: state => state.laundry_types // mengambil state laundry types
        })
    },
    methods: {
        ...mapActions('product', ['getLaundryType', 'addLaundryType', 'addProductLaundry', 'editProduct', 'updateProduct']),

        addNewLaundryType(){
            //mengirim permintaan ke server untuk disimpan
            this.addLaundryType({ name_laundry_type: this.laundry_type }).then(() => {
                //mengamnil data terbaru dari server

                this.getLaundryType().then(() => {
                    //form diset false kembali
                    this.showForm = false
                    this.laundry_type = ''
                })
            })
        },
        clearForm(){
            this.product = {
                name: '',
                unit_type: '',
                price: '',
                laundry_type: '',
                service: '',
                service_type: ''
            }
        },

        submit(){
            //apabila diaksesnya dengan route namne product add
            if(this.$route.name == 'products.add'){
                //maka fungsi ini dijalankan untuk menambah product baru
                this.addProductLaundry(this.product).then(() => {
                    //kosongkan variable ketika berhasi menyimpan
                   this.clearForm()
                    //redirect kembali ke halaman list product
                    this.$router.push({ name: 'products.data' })
                })
                //ketika di akses denan produk edit
            }else if( this.$route.name == 'products.edit' ){
                //id akan ditambahkan ke dalam object variable product
                Object.assign(this.product, { id:this.$route.params.id })
                //kirim permintaan ke server untutk mengubah data
                this.updateProduct(this.product).then(() => {
                    //kosongkan variable
                    this.clearForm()
                    //redirect kembali
                    this.$router.push({ name: 'products.data' })
                })
            }
        }
    }
}
</script>
