<template>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-5">
                <div class="panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">Assign Role to User</h3>
                    </div>

                    <!-- form untuk menambahkan role ke user -->
                    <div class="panel-body">
                        <div class="alert alert-success" v-if="alert_role">Has Been Added</div>
                        <div class="form-group">
                            <label for="">Role</label>
                            <select class="form-control" v-model="role_user.role">
                                <option value="">Pilih</option>
                                <option v-for="(row, index) in roles" :value="row.name" :key="index">{{ row.name }}</option>
                            </select>
                            <p class="text-danger" v-if="errors.role_id">{{ errors.role_id[0] }}</p>
                        </div>
                        <div class="form-group">
                            <label for="">User</label>
                            <select class="form-control" v-model="role_user.user_id">
                                <option value="">Pilih</option>
                                <option v-for="(row, index) in users" :value="row.id" :key="index">
                                    {{ row.name }} ({{ row.email }})
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-danger btn-sm" @click="setRole">Set Role</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">Set Permission</h3>
                    </div>
                    <div class="panel-body">
                        <div class="form-group">
                            <label for="">Role</label>
                            <select class="form-control" v-model="role_selected">
                                <option value="">Pilih</option>
                                <option v-for="(row, index) in roles" :value="row.id" :key="index">{{ row.name }}</option>
                            </select>
                            <p class="text-danger" v-if="errors.role_id">{{ errors.role_id[0] }}</p>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary btn-sm" @click="checkPermission">{{ loading ? 'Loading..':'Check' }}</button>
                        </div>
                        <div class="form-group">
                            <div class="alert alert-success" v-if="alert_permission">Permission has been assigned</div>
                            <div class="nav-tabs-custom">
                                <ul class="nav nav-tabs">
                                    <li class="active">
                                        <a href="#tab_1" data-toggle="tab">Permissions</a>
                                    </li>
                                </ul>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="tab_1">
                                        <template v-for="( row, index ) in permissions">
                                            <input type="checkbox"
                                                    class="minimal-red"
                                                    :key="index"
                                                    :value="row.name"
                                                    :checked="role_permission.findIndex(x => x.name == row.name) != -1" @click="addPermission(row.name)">
                                            {{ row.name }} <br :key="'row' + index">
                                            <br :key="'enter' + index" v-if="(index+1) % 4 == 0">
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pull-right">
                            <button class="btn btn-primary btn-sm" @click="setPermission">
                                <i class="fa fa-send"></i> Set Permission
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
    name: 'SetPermission',
    data(){
        return {
            role_user: {
                role: '',
                user_id: ''
            },
            role_selected: '',
            new_permission: [],
            loading: false,
            alert_permission: false,
            alert_role: false
        }
    },
    created() {
        //ketika di load maka akan me request ke 3 component tersebut
        this.getRoles() //Data roles
        this.getAllPermission() //data permission
        this.getUserLists()// Data Users
    },
    computed: {
        ...mapState(['errors']), //load state errros
        ...mapState('user', {
            users: state => state.users, //load state users
            roles: state => state.roles, //load state roles
            permissions: state => state.permissions, //load state permission

            //state yg menampung permission yg telah di assign
            role_permission: state => state.role_permission
        })
    },
    methods: {
        //load semua fungsi yg ada di module store user
        ...mapActions('user', [
            'getUserLists',
            'getRoles',
            'getAllPermission',
            'getRolePermission',
            'setRolePermission',
            'setRoleUser'
        ]),
        //load mutation dari store user
        ...mapMutations('user', ['CLEAR_ROLE_PERMISSION']),

        setRole(){
            //mengirim permintaan ke backend
            this.setRoleUser(this.role_user).then(() => {
                this.alert_role = true //ketika berhasil mengaktifkan alert
                setTimeout(() => {
                    //set default role user
                    this.role_user = {
                        role: '',
                        user_id: ''
                    }
                    //matikan alert
                    this.alert_role = false
                }, 1000)
            })
        },
        //ketika list permission di centang, makan fungsi ini berja;an
        addPermission(name){
            //di cek berdasarkan name
            let index = this.new_permission.findIndex(x => x == name)
            //apabila tidak tersedia indexnya -1
            if(index == -1){
                //maka akan menambhkan ke list
                this.new_permission.push(name)
            }else{
                //jika sudah ada maka hapus dari list
                this.new_permission.splice(index, x, name)
            }

        },
        //fungsi yg telah di assign ke dalam role yg dipilih
        checkPermission(){
            this.loading = true //mengaktifkan loading tombol
            //mengirim permintaan ke back end
            this.getRolePermission(this.role_selected).then(() => {
                //apabila berhasil, matikan loading
                this.loading = false
                //permission yg telah di assign akan di merge ke new permission
                this.new_permission = this.role_permission
            })
        },

        //fungsi akan berja;an ketikan tombol set permission di tekan
        setPermission(){
            //mengirim permintaan ke server
            this.setRolePermission({
                role_id: this.role_selected,
                permissions: this.new_permission
            }).then((res) => {
                //apahbila berhasi;
                if(res.status == 'success'){
                    //mengaktifkan alert
                    this.alert_permission = true
                    setTimeout(() => {
                        //mengembalika ke dafault
                        this.role_selected = ''
                        this.new_permission = []
                        this.loading = false
                        this.alert_permission = false
                        this.CLEAR_ROLE_PERMISSION()
                    }, 1000)
                }
            })
        }
    }
}
</script>

<style>
    .tab-pane{
        height: 150px;
        overflow-y:scroll;
    }
</style>
