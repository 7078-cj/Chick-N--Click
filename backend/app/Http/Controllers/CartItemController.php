<?php

namespace App\Http\Controllers;

use App\Models\CartItems;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CartItemController extends Controller  implements HasMiddleware
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

        // Find existing cart item or create a new one
        $cartItem = $user->Cart()->updateOrCreate(
            ['food_id' => $foodId], // match condition
            ['quantity' => $request->input('quantity', 1)] // update or set
        );

        return response()->json([
            'message' => 'Food added to cart!',
            'cart_item' => $cartItem->load('food') // return with food details
        ]);
    }

    public function userCart(Request $request)
    {
        $user = $request->user();

        // Eager load food relation
        $cartItems =  $user->Cart()->with('food')->get();

        $cartData = $cartItems->map(function ($item) {
            $food = $item->food;

            return [
                'id' => $item->id,
                'food_id' => $item->food_id,
                'food_name' => $food->food_name ?? 'Unknown',
                'price' => $food->price ?? 0,
                'quantity' => $item->quantity,
                'subtotal' => ($food->price ?? 0) * $item->quantity,
                'thumbnail' => $food && $food->thumbnail 
                    ? asset('storage/' . $food->thumbnail) 
                    : 'https://via.placeholder.com/150x100?text=No+Image',
            ];
        });

        $total = $cartData->sum('subtotal');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'cart' => $cartData,
            'total' => $total,
        ]);
    }

    public function removeToCart(Request $request, $foodId){

        $user = $request->user();

        $user->Cart()->detach($foodId);

        return ["removed_to_cart" => 'Food removed to cart!'];
    }
}
