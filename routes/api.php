<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth:api'], function(){
    Route::resource('/outlets', 'API\OutletControl')->except(['show']);

    Route::resource('/couriers', 'API\UserControl')->except(['create','show','update']);
    Route::post('/couriers/{id}', 'API\UserControl@update')->name('couriers.update');

    Route::resource('product', 'API\ProductControl')->except(['create', 'show']);
    Route::get('/product/laundry-type', 'API\ProductControl@getLaundryType');
    Route::post('/product/laundry-type', 'API\ProductControl@storeLaundryType');

    Route::get('roles', 'API\RolePermissionControl@getAllRole')->name('roles');
    Route::get('permissions', 'API\RolePermissionControl@getAllPermission')->name('permission');
    Route::post('role-permission', 'API\RolePermissionControl@getRolePermission')->name('role_permission');
    Route::post('set-role-permission', 'API\RolePermissionControl@setRolePermission')->name('set_role_permission');
    Route::post('set-role-user', 'API\RolePermissionControl@setRoleUser')->name('user.set_role');
    Route::get('user-authenticated', 'API\UserControl@getUserLogin')->name('user.authenticated');
    Route::get('user-lists', 'API\UserControl@userLists')->name('user.index');
});

Route::post('/login', 'Auth\LoginController@login');
// Route::resource('outlets', 'API\OutletControl')->except(['show']);
