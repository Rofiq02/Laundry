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
});

Route::post('/login', 'Auth\LoginController@login');
// Route::resource('outlets', 'API\OutletControl')->except(['show']);
