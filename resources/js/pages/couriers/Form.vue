<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.name }">
            <label for="">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="courier.name" :readonly="$route.name == 'outlets.edit'">
            <p class="text-danger" v-if="errors.name">{{ errors.name[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.email }">
            <label for="">Email</label>
            <input type="email" class="form-control" v-model="courier.email">
            <p class="text-danger" v-if="errors.email">{{ errors.email[0] }}</p>
        </div>
         <div class="form-group" :class="{ 'has-error': errors.password }">
            <label for="">Password</label>
            <input type="password" class="form-control" v-model="courier.password">
            <p class="text-danger" v-if="errors.password">{{ errors.password[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.outlet_id }">
            <label for="">Outlet</label>
            <select name="outlet_id" class="form-control" v-model="courier.outlet_id">
                <option value="">Pilih</option>
                <option v-for="(row, index) in outlets.data" :value="row.id" :key="index">{{ row.name }}</option>
            </select>
            <p class="text-danger" v-if="errors.outlet_id">{{ errors.outlet_id[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.photo }">
            <label for="">Foto</label>
            <input type="file" class="form-control" accept="image/*" @change="uploadImage($event)" id="file-input">
            <p class="text-warning">Mau ganti Foto</p>
            <p class="text-danger" v-if="errors.photo">{{ errors.photo[0] }}</p>
        </div>
    </div>
</template>
