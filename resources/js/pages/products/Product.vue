<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'products.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="cari" v-model="search">
                </div>
            </div>
            <div class="panel-body">
                <b-table striped hover bordered :items="products.data" :fields="fields" show-empty>
                    <template v-slot:cell(laundry_type)="row">
                        {{ row.item.type.name }}
                    </template>
                    <template v-slot:cell(user_id)="row">
                        {{ row.item.user.name }}
                    </template>
                    <template v-slot:cell(service)="row">
                        {{ row.item.service }} {{ row.item.service_type }}
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{ name: 'products.edit', params: { id: row.item.id } }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteProduct(row.item.id)"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="products.data"><i class="fa fa-bars"></i> {{ products.data.length }} item dari {{ products.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                                v-model="page"
                                :total-rows="products.meta.total"
                                :per-page="products.meta.per_page"
                                aria-controls="products"
                                v-if="products.data && products.data.length > 0">
                            </b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    name: 'DataProduct',
    created() {
        this.getProducts()//melakuka request ketika component di load
    },
    data(){
        return {
            //fields untuk mengisi header table yg akan ditampilkan
            fields: [
                { key: 'name', label: 'Nama Item' },
                { key: 'unit_type', label: 'Tipe' },
                { key: 'laundry_type', label: 'Jenis Data' },
                { key: 'price', label: 'Harga' },
                { key: 'user_id', label: 'Admin' },
                { key: 'service', label: 'Lama Pengerjaan' },
                { key: 'actions', label: 'Aksi' }
            ],
            //variable untuk form search
            search: ''
        }
    },
    computed: {
        //meload state dari module product
        ...mapState('product', {
            products: state => state.products, //State products
        }),
        page: {
            get(){
                return this.$store.state.product.page //load state page
            },
            set(val){
                this.$store.commit('product/SET_PAGE', val)// set state page ketika value berubah
            }
        }
    },
    watch: {
        //ketika terjadi perubahan value dari page
        page(){
            this.getProducts() //ambil data terbaru
        },
        //ketika terjadi perubahan value dari search
        search(){
            this.getProducts(this.search) //ambil data terbaru dari search
        }
    },
    methods: {
        ...mapActions('product', ['getProducts', 'removeProduct']), //load actin dari module product
        deleteProduct(id){
           this.$swal({
                title: 'Kamu Yakin?',
                text: "Tindakan ini akan menghapus secara permanent!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iya, Lanjutkan!'
            }).then((result) => {
                if (result.value) {
                    this.removeProduct(id)
                }
            })
        }
    }
}
</script>
