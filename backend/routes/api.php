<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymongoController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::get('/user',[AuthController::class, 'userDetails'])->middleware('auth:sanctum');
Route::put('/user/update',[AuthController::class, 'updateUser'])->middleware('auth:sanctum');
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::get('/cart', [CartItemController::class, 'userCart']);
Route::post('/cart/add/{foodId}', [CartItemController::class, 'addToCart']);
Route::delete('/cart/remove/{foodId}', [CartItemController::class, 'removeToCart']);

Route::post('/order/place', [OrderController::class, 'placeOrder']);
Route::get('/orders', [OrderController::class, 'getUserOrder']);
Route::get('/orders/all', [OrderController::class, 'allOrders']);
Route::post('/order/{id}/cancel', [OrderController::class, 'cancelOrder']);
Route::put('/order/{id}/status', [OrderController::class, 'updateOrderStatus']);
Route::put('/order/{id}/etc', [OrderController::class, 'updateOrderETC']);
Route::delete('/order/{id}/delete', [OrderController::class, 'deleteOrder']);

Route::apiResource('foods', FoodController::class);
Route::apiResource('category', CategoryController::class);

Route::post('/payments/create-checkout', [PaymongoController::class, 'createCheckout']);
Route::get('/payments/verify/{orderId}', [PaymongoController::class, 'verifyByOrder']);