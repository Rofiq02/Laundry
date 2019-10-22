<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Edit Customer</h3>
            </div>
            <div class="panel-body">
                <customer-form />
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Update
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import FormCustomer from './Form.vue'
export default {
    name: 'EditCustomer',
    created(){
        this.editCustomer(this.$route.params.id) //load Single data customer berdasarkan id
    },
    methods: {
        ...mapActions('customer', ['editCustomer', 'updateCustomer']),
        submit(){
            //mengirim permintaan ke server untuk mengubah data
            this.updateCustomer(this.$route.params.id).then(() => {
                this.$router.push({ name: 'customers.data' }) //ketika update berhasil maka redirect ke halaman list customer
            })
        }
    },
    components: {
        'customer-form': FormCustomer
    },
}
</script>
