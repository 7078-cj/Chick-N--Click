<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FoodController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;





Route::get('/test', function (Request $request) {
    return response()->json(['message' => 'Hello REACT']);
});

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/logout',[AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/cart/add/{foodId}', [CartController::class, 'addToCart']);
Route::delete('/cart/remove/{foodId}', [CartController::class, 'removeToCart']);

Route::apiResource('foods', FoodController::class);