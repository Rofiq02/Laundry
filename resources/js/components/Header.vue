<template>
    <header class="main-header">
        <nav class="navbar navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <router-link to="/" class="navbar-brand"><b>Laundry</b></router-link>
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>

                <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><router-link to="/">Home <span class="sr-only">(current)</span></router-link></li>
                        <li v-if="$can('read outlets')"><router-link :to="{ name: 'outlets.data' }">Outlets</router-link></li>
                        <li v-if="$can('read couriers')"><router-link :to="{ name: 'couriers.data' }">Courier</router-link></li>
                        <li v-if="$can('read products')"><router-link :to="{ name: 'products.data' }">Products</router-link></li>
                         <li><router-link :to="{ name: 'expenses.data' }">Expenses</router-link></li>
                         <li><router-link :to="{ name: 'customers.data' }">Customer</router-link></li>
                         <li class="dropdown">
                            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Transactions <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                 <li><router-link :to="{ name: 'transactions.list' }">List</router-link></li>
                                 <li><router-link :to="{ name: 'transactions.add' }">Add New</router-link></li>
                            </ul>
                        </li>
                        <li class="dropdown" v-if="authenticated.role == 0">
                            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Settings <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><router-link :to="{ name: 'role.permissions' }">Role Permission</router-link></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" id="navbar-search-input" placeholder="Search">
                        </div>
                    </form>
                </div>
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <li class="dropdown messages-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-bell-o"></i>
                                <span class="label label-success">{{ notifications.length }}</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header">You have {{ notifications.length }} messages</li>
                                <li>
                                    <ul class="menu" v-if="notifications.length > 0">
                                        <li v-for="(row, index) in notifications" :key="index">
                                            <a href="javascript:void(0)" @click="readNotif(row)">
                                                <div class="pull-left">
                                                    <img src="https://via.placeholder.com/160" class="img-circle" alt="User Image">
                                                </div>
                                                <h4>
                                                    <!-- Nama Pengirim -->
                                                    {{ row.data.sender_name }}
                                                    <small><i class="fa fa-clock-o"></i> {{ row.created_at | formatDate }}</small>
                                                </h4>
                                                <!-- Jenis permintaan notifikasi -->
                                                <p>{{ row.data.expenses.description.substr(0, 30) }}</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <!-- <li class="footer"><a href="#">See All Messages</a></li> -->
                            </ul>
                        </li>
                        <!-- <li class="dropdown notifications-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-bell-o"></i>
                                <span class="label label-warning">10</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header">You have 10 notifications</li>
                                <li>
                                    <ul class="menu">
                                        <li>
                                            <a href="#">
                                                <i class="fa fa-users text-aqua"></i> 5 new members joined today
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="footer"><a href="#">View all</a></li>
                            </ul>
                        </li>
                        <li class="dropdown tasks-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-flag-o"></i>
                                <span class="label label-danger">9</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header">You have 9 tasks</li>
                                <li>
                                    <ul class="menu">
                                        <li>
                                            <a href="#">
                                                <h3>
                                                    Design some buttons
                                                    <small class="pull-right">20%</small>
                                                </h3>
                                                <div class="progress xs">
                                                    <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                        <span class="sr-only">20% Complete</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="footer">
                                    <a href="#">View all tasks</a>
                                </li>
                            </ul>
                        </li> -->
                        <li class="dropdown user user-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <img src="https://via.placeholder.com/160" class="user-image" alt="User Image">
                                <span class="hidden-xs">{{ authenticated.name }}</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="user-header">
                                    <img src="https://via.placeholder.com/160" class="img-circle" alt="User Image">
                                    <p>{{ authenticated.name }}</p>
                                </li>
                                <li class="user-body">
                                    <div class="row">
                                        <!-- <div class="col-xs-4 text-center">
                                            <a href="#">Followers</a>
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <a href="#">Sales</a>
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <a href="#">Friends</a>
                                        </div> -->
                                    </div>
                                </li>
                                <li class="user-footer">
                                    <div class="pull-left">
                                        <a href="#" class="btn btn-default btn-flat">Profile</a>
                                    </div>
                                    <div class="pull-right">
                                        <a href="javascript:void(0)" @click="logout" class="btn btn-default btn-flat">Sign out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
    computed: {
        ...mapState('user', {
            authenticated: state => state.authenticated //Me load state authenticated
        }),

        ...mapState('notification', {
            notifications: state => state.notifications //mengambil state notifacation
        })
    },
    filters: {
        //untuk mengubah format yanggal menjadi time ago
        formatDate(val){
            return moment(new Date(val)).fromNow()
        }
    },
    methods: {
        ...mapActions('notification', ['readNotification']), //mendefinisi fungsi read notif

        //ketika notifikasi di klik maka akan menjalankan fungsi ini
        readNotif(row){
            //mengirimkan request ke server bahwa notifikasi telah dibaca
            this.readNotification({ id: row.id }).then(() => this.$router.push({ name: 'expenses.view', params: { id: row.data.expenses.id } }))
        },

        //ketika tombol logout ditekan, fungsi ini dijalankan
        logout(){
            return new Promise((resolve, reject) => {
                localStorage.removeItem('token') //menghapus token dari localstorage
                resolve()
            }).then(() => {
                //memperbarui state token
                this.$store.state.token = localStorage.getItem('token')
                this.$router.push('/login')// redirect le page login
            })
        }
    }
}
</script>
