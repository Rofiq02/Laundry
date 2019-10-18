<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'couriers.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="cari" v-model="search">
                </div>
            </div>
            <div class="body">
                <!-- untuk menampilkan data courie -->
                <b-table striped hover bordered :items="couriers.data" :fields="fields" show-empty>

                    <!-- custome template untuk menampilkan gambar m-->
                    <template v-slot:cell(photo)="row">
                        <img :src="'/storage/couriers/' + row.item.photo" :width="80" :height="50" :alt="row.item.name">
                    </template>
                    <template v-slot:cell(outlet_id)="row">
                        {{ row.item.outlet.name }}
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{ name: 'couriers.edit', params: {id: row.item.id} }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteCourier(row.item.id)"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>

                <!-- Jumlah data dan pagination -->
                <div class="row">
                    <div class="col-md-6">
                        <p v-if="couriers.data"><i class="fa fa-bars"></i> {{ couriers.data.length }} item dari {{ couriers.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination v-model="page"
                                            :total-rows="couriers.meta.total"
                                            :per-page="couriers.meta.per_page"
                                            aria-controls="couriers"
                                            v-if="couriers.data && couriers.data.length > 0">
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
    name: 'DataCourier',
    created(){
        this.getCouriers() // untuk menjalankan data
    },
    data(){
        return {
            fields: [
                { key: 'photo', label: '#' },
                { key: 'name', label: 'Nama Lengkap' },
                { key: 'email', label: 'Email' },
                { key: 'outlet_id', label: 'Outlet' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: ''
        }
    },
    computed: {
        ...mapState('courier', {
            couriers: state => state.couriers //state menyimpan data courier
        }),
        //state page untuk mengambil dan mengubah data state
        page: {
            get(){
                return this.$store.state.courier.page
            },
            set(val){
                this.$store.commit('courier/SET_PAGE', val)
            }
        }
    },
    watch: {
        //ketika terjadi perubahan value dari page
        page(){
            this.getCouriers() //maka fungsi ini dijalankan
        },
        //ketika terjadi perubahan value dari search box
        search(){
            this.getCouriers(this.search) //fungsi ini dijalankan
        }
    },
    methods: {
        ...mapActions('courier', ['getCouriers', 'removeCourier']), //memanggil fungsi yang ada di store courier

        //fungsi delete
        deleteCourier(id){
            this.$swal({
                title: 'Kamu Yakin?',
                text: 'Tindakan ini akan menghapus secara permanent!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iya'
            }).then((result) => {
                if(result.value){
                    this.removeCourier(id)
                }
            })
        }
    }
}
</script>
