<template>
   <div class="col-md-12">
       <div class="panel">
           <div class="panel-heading">
               <router-link :to="{ name: 'outlets.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
               <div class="pull-right">
                   <input type="text" class="from-control" placeholder="cari" v-model="search">
               </div>
           </div>
           <div class="panel-body">
               <b-table striped hover bordered :items="outlets.data" :fields="fields" show-empty>
                   <template slot="status" slot-scope="row">
                       <span class="label label-success" v-if="row.item.status == 1">Active</span>
                       <span class="label label-default" v-else>Inactive</span>
                   </template>
                   <template v-slot:cell(actions)="row">
                       <router-link :to="{ name: 'outlets.edit', params: {id: row.item.code} }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                       <button class="btn btn-danger btn-sm" @click="deleteOutlet(row.item.id)"><i class="fa fa-trash"></i></button>
                   </template>
               </b-table>

               <div class="row">
                   <div class="col-md-6">
                       <p v-if="outlets.data"><i class="fa fa-bars"></i> {{ outlets.data.length }} item dari {{ outlets.meta.total }} total data</p>
                   </div>
                   <div class="col-md-6">
                       <div class="pull-right">
                           <b-pagination v-model="page" :total-rows="outlets.meta.total"
                                                        :per-page="outlets.meta.per_page"
                                                        aria-controls="outlets"
                                                        v-if="outlets.data && outlets.data.length > 0">
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
    name: 'DataOutlet',
    created(){
        //sebelum component di load, request data dari server
        this.getOutlets()
    },
    data(){
        return {
            //koneksi antara b table dengan database\
            fields: [
                { key: 'code', label: 'Kode Outlet' },
                { key: 'name', label: 'Nama Outlet' },
                { key: 'address', label: 'Alamat' },
                { key: 'phone', label: 'Telp' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: ''
        }
    },
    computed: {
        //mengambil data outlets dari state outlest
        ...mapState('outlet', {
            outlets: state => state.outlets
        }),
        page: {
            get(){
                //mengambil value page dari vuex module outlet
                return this.$store.state.outlet.page
            },
            set(val){
                //melakukan perubahan otomatis pada value
                this.$store.commit('outlet/set_page', val)
            }
        }
    },
    watch: {
        page() {
            //Apabila value dari page berubah maka akan meminta dari server
            this.getOutlets()
        },
        search(){
            //APABILA VALUE DARI SEARCH BERUBAH MAKA AKAN MEMINTA DATA
            //SESUAI DENGAN DATA YANG SEDANG DICARI
            this.getOutlets(this.search)
        }
    },
    methods: {
        //mengamibil fungsi dari vuex module outlet
        ...mapActions('outlet', ['getOutlets', 'removeOutlet']),

        deleteOutlet(id){
            this.$swal({
                title: 'Kamu Yakin?',
                text: 'Tindakan ini akan menghapus secara permanet!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya'
            }).then((result) => {
                if(result.value){
                    this.removeOutlet(id)
                }
            })
        }
    }
}
</script>
