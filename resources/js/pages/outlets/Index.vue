<template>
    <div class="container">
        <section class="content-header">
            <h1>
                Manage Outlets
            </h1>
            <breadcrumb />
        </section>

        <section class="content">
            <div class="row">
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>
<script>
    import breadcrumb from '../../components/Breadcrumb.vue'
    export default {
        name: 'IndexOutlet',
        components: {
            'breadcrumb': breadcrumb
        }
    }
</script>
