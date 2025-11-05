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
            'sides'    => 'array|nullable',
            'drinks'   => 'array|nullable',
            'sides.*.id'  => 'integer|exists:food,id',
            'sides.*.size' => 'string|nullable',
            'drinks.*.id'  => 'integer|exists:food,id',
            'drinks.*.size' => 'string|nullable',
        ]);

        // --- Add or update the main food item ---
        $cartItem = $user->Cart()->updateOrCreate(
            ['food_id' => $foodId, 'parent_cart_item_id' => null], // main items have no parent
            ['quantity' => $validated['quantity'] ?? 1]
        );

        // --- Handle Sides ---
        if (!empty($validated['sides'])) {
            foreach ($validated['sides'] as $side) {
                $user->Cart()->Create(
                    [
                        'food_id' => $side['id'],
                        'parent_cart_item_id' => $cartItem->id, // tie to main cart item
                         'quantity' => 1,
                    ]
                );
            }
        }

        // --- Handle Drinks ---
        if (!empty($validated['drinks'])) {
            foreach ($validated['drinks'] as $drink) {
                $user->Cart()->Create(
                    [
                        'food_id' => $drink['id'],
                        'parent_cart_item_id' => $cartItem->id, // tie to main cart item
                        'quantity' => 1,
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

        // Eager load food relation with categories
        $cartItems = $user->Cart()->with('food', 'food.categories')->get();

        $cartData = $cartItems->map(function ($item) {
            $food = $item->food;

            // Check if the food has Addons category
            $isAddon = $food && $food->categories->contains('name', 'Addons');

            return [
                'id' => $item->id,
                'food_id' => $item->food_id,
                'food_name' => $food->food_name ?? 'Unknown',
                'price' => $food->price ?? 0,
                'quantity' => $item->quantity,
                'subtotal' => ($food->price ?? 0) * $item->quantity,
                'thumbnail' =>$food->thumbnail,
                'is_addon' => $isAddon, // <-- new field for frontend
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

        // Find the main cart item (no parent)
        $cartItem = $user->Cart()
            ->where('food_id', $foodId)
            ->whereNull('parent_cart_item_id')
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Food not found in cart.'
            ], 404);
        }

        // Delete all addons tied to this cart item
        $cartItem->addons()->delete();

        // Delete the main cart item
        $cartItem->delete();

        return response()->json([
            'message' => 'Food and its add-ons removed from cart!'
        ]);
    }
}
