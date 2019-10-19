<template>
    <div class="container">
        <section class="content-header">
            <h1>
                Setting Pages
            </h1>
            <breadcrumb />
        </section>

        <section class="content">
            <div class="row">
                <router-view />
            </div>
        </section>
    </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
export default {
    name: 'IndexSetting',
    components: {
        'breadcrumb' : Breadcrumb
    }
}
</script>
