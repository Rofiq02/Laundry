<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Add New Customer</h3>
            </div>
            <div class="panel-body">
                <!-- load view dari form.vue -->
                <customer-form></customer-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Add New
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import FormCustomer from './Form.vue'
export default {
    name: 'AddCustomer',
    data(){
        return {

        }
    },
    methods: {
        ...mapActions('customer', ['submitCustomer']),
        //ketika tombol ditekan maka fungsi ini akan dijalankan
        submit(){
            //melakukan request ke server untuk menambakan data
            this.submitCustomer().then(() => {
                //kemudian redirect ke halam list customer
                this.$router.push({ name: 'customers.data' })
            })
        }
    },
    components: {
        'customer-form' : FormCustomer //custom tag
    }
}
</script>
