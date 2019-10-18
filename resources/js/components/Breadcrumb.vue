<template>
    <ol class="breadcrumb">
        <li><router-link :to="{ name: 'home' }"><i class="fa fa-dashboard"></i>Home</router-link></li>
        <li class="active">{{ $route.meta.title }}</li> <!-- mengambil title dari route.js -->
    </ol>
</template>

<script>
export default {

}
</script>
