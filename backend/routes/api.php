<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;






Route::get('/test', function (Request $request) {
    return response()->json(['message' => 'Hello REACT']);
});

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::get('/user',[AuthController::class, 'userDetails'])->middleware('auth:sanctum');
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/cart', [CartItemController::class, 'userCart']);
Route::post('/cart/add/{foodId}', [CartItemController::class, 'addToCart']);
Route::delete('/cart/remove/{foodId}', [CartItemController::class, 'removeToCart']);

Route::post('/order/place', [OrderController::class, 'placeOrder']);
Route::post('/orders', [OrderController::class, 'getUserOrder']);
Route::post('/order/{id}/cancel', [OrderController::class, 'cancelOrder']);
Route::put('/order/{id}/status', [OrderController::class, 'updateOrderStatus']);

Route::apiResource('foods', FoodController::class);