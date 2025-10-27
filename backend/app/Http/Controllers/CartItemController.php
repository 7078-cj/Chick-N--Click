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

        $validated = $request->validate([
            'quantity' => 'integer|min:1',
            'sides'  => 'array|nullable',
            'drinks' => 'array|nullable',
            'sides.*.id' => 'integer|exists:food,id',
            'sides.*.size' => 'string|nullable',
            'drinks.*.id' => 'integer|exists:food,id',
            'drinks.*.size' => 'string|nullable',
        ]);

        // --- Add the main food item ---
        $cartItem = $user->Cart()->updateOrCreate(
            ['food_id' => $foodId],
            ['quantity' => $validated['quantity'] ?? 1]
        );

        // --- Handle Sides ---
        if (!empty($validated['sides'])) {
            foreach ($validated['sides'] as $side) {
                $user->Cart()->updateOrCreate(
                    [
                        'food_id' => $side['id'],
                        'type' => 'side', 
                    ],
                    [
                        'quantity' => 1,
                        'parent_food_id' => $foodId, 
                    ]
                );
            }
        }

      
        if (!empty($validated['drinks'])) {
            foreach ($validated['drinks'] as $drink) {
                $user->Cart()->updateOrCreate(
                    [
                        'food_id' => $drink['id'],
                        'type' => 'drink',
                    ],
                    [
                        'quantity' => 1,
                        'size' => $drink['size'] ?? 'medium',
                        'parent_food_id' => $foodId,
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'Food and add-ons added to cart successfully!',
            'cart_item' => $cartItem->load('food')
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
            'cart' => $cartData,
            'total' => $total,
        ]);
    }

   public function removeToCart(Request $request, $foodId)
    {
        $user = $request->user();

       
        $cartItem = $user->Cart()->where('food_id', $foodId)->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Food not found in cart.'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Food removed from cart!'
        ]);
    }
}
