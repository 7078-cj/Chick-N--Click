<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CartController extends Controller  implements HasMiddleware
{
     public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }
    public function addToCart(Request $request, $foodId)
    {
        $user = $request->user();

        $user->foodsInCart()->syncWithoutDetaching([
            $foodId => ['quantity' => $request->input('quantity', 1)]
        ]);

        return ["add_to_cart" => 'Food added to cart!'];
    }

    public function removeToCart(Request $request, $foodId){

        $user = $request->user();

        $user->foodsInCart()->detach($foodId);

        return ["removed_to_cart" => 'Food removed to cart!'];
    }
}
