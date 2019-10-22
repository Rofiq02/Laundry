<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'customers.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="cari" v-model="search">
                </div>
            </div>
            <div class="panel-body">
                <!-- menampilkan data -->
                <b-table striped horver bordered :items="customers.data" :fields="fields" show-empty>
                    <template v-slot:cell(deposit)="row">
                        Rp {{ row.item.deposit }}
                    </template>

                    <!-- nama kurir akan ditampikan jika ada -->
                    <template v-slot:cell(courier_id)="row">
                        {{ row.item.courier ? row.item.courier.name: '-' }}
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{ name: 'customers.edit', params: {id: row.item.id} }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.item.id)"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="customers.data"><i class="fa fa-bars"></i> {{ customers.data.length }} item dari {{ customers.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                                    v-model="page"
                                    :total-rows="customers.meta.total"
                                    :per-page="customers.meta.per_page"
                                    aria-controls="customers"
                                    v-if="customers.data && customers.data.length > 0">
                            </b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'DataCustomer',
    created(){
        this.getCustomers() //load data customers
    },
    data(){
        return {
            fields: [
                { key: 'nik', label: 'NIK' },
                { key: 'name', label: 'Nama Lengkap' },
                { key: 'address', label: 'Alamat' },
                { key: 'phone', label: 'Telp' },
                { key: 'point', label: 'point' },
                { key:'deposit', label: 'Deposit' },
                { key: 'courier_id', label: 'Invited By' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: ''
        }
    },
    computed: {
        ...mapState('customer', {
            customers: state => state.customers // mengambil data customers dari state customers
        }),
        //mengambil data page dari state customers
        page: {
            get(){
                return this.$store.state.customer.page
            },
            set(val){
                this.$store.commit('customer/SET_PAGE', val)
            }
        }
    },
    watch: {
        page(){
            this.getCustomers() //ketika value terjadi perubahan maka request data baru
        },
        search(){
            this.getCustomers(this.search)// ketika  value search terjadi perubahan maka akan request data baru
        }
    },
    methods: {
        ...mapActions('customer', ['getCustomers', 'removeCustomer']),
        //ketika tombol hapus ditekan maka fungsi ini akan dijalankan
        deleteCustomer(id){
            this.$swal({
                title: 'Kamu Yakin?',
                text: 'Tindakan ini akan menghapus secara permanent!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iya, Lanjutkan!',
            }).then((result) => {
                if(result.value){
                    this.removeCustomer(id)
                }
            })
        }
    }
}
</script>
