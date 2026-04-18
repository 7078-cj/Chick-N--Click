<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CartItemController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    /**
     * Build cart array + total for API responses.
     */
    private function cartPayloadForUser($user): array
    {
        $cartItems = $user->Cart()
            ->with('food.categories', 'parent.food')
            ->get();

        $addonCategoryNames = ['Addons', 'Addon', 'Sides', 'Drinks'];

        $cartData = $cartItems->map(function ($item) use ($addonCategoryNames) {
            $food = $item->food;

            $isAddon = $food && $food->categories->contains(
                fn ($cat) => in_array($cat->name, $addonCategoryNames, true),
            );

            $parentMainFoodId = null;
            if ($item->parent_cart_item_id && $item->relationLoaded('parent') && $item->parent) {
                $parentMainFoodId = $item->parent->food_id;
            }

            return [
                'id' => $item->id,
                'food_id' => $item->food_id,
                'food_name' => $food->food_name ?? 'Unknown',
                'price' => $food->price ?? 0,
                'quantity' => $item->quantity,
                'subtotal' => ($food->price ?? 0) * $item->quantity,
                'thumbnail' => $food->thumbnail,
                'is_addon' => $isAddon,
                'parent_cart_item_id' => $item->parent_cart_item_id,
                'parent_food_id' => $parentMainFoodId,
            ];
        });

        $total = $cartData->sum('subtotal');

        return [
            'cart' => $cartData,
            'total' => $total,
        ];
    }

    /**
     * True when the client is setting an absolute main-line quantity (cart screen).
     * Menu "add to cart" always sends `sides` and `drinks` keys (possibly empty arrays).
     */
    private function isAbsoluteQuantityUpdate(Request $request): bool
    {
        return !$request->has('sides') && !$request->has('drinks');
    }

    /**
     * After main quantity is set, keep add-on rows within the meal cap (min 1 each).
     */
    private function capAddonQuantitiesToMain($mainCartItem): void
    {
        if (!$mainCartItem) {
            return;
        }
        $cap = (int) $mainCartItem->quantity;
        foreach ($mainCartItem->addons as $addon) {
            $next = max(1, min((int) $addon->quantity, $cap));
            if ($next !== (int) $addon->quantity) {
                $addon->quantity = $next;
                $addon->save();
            }
        }
    }

    public function addToCart(Request $request, $foodId)
    {
        $user = $request->user();

        $validated = $request->validate([
            'quantity' => 'integer|min:1',
            'sides' => 'sometimes|array',
            'drinks' => 'sometimes|array',
            'sides.*.id' => 'integer|exists:food,id',
            'sides.*.size' => 'string|nullable',
            'drinks.*.id' => 'integer|exists:food,id',
            'drinks.*.size' => 'string|nullable',
        ]);

        $addQty = (int) ($validated['quantity'] ?? 1);
        $absolute = $this->isAbsoluteQuantityUpdate($request);

        $cartItem = $user->cart()
            ->where('food_id', $foodId)
            ->whereNull('parent_cart_item_id')
            ->first();

        if ($absolute) {
            if ($cartItem) {
                $cartItem->quantity = $addQty;
                $cartItem->save();
            } else {
                $cartItem = $user->cart()->create([
                    'food_id' => $foodId,
                    'parent_cart_item_id' => null,
                    'quantity' => $addQty,
                ]);
            }
            $cartItem->load('addons');
            $this->capAddonQuantitiesToMain($cartItem);
        } else {
            if ($cartItem) {
                $cartItem->quantity += $addQty;
                $cartItem->save();
            } else {
                $cartItem = $user->cart()->create([
                    'food_id' => $foodId,
                    'parent_cart_item_id' => null,
                    'quantity' => $addQty,
                ]);
            }

            $sides = $validated['sides'] ?? [];
            $drinks = $validated['drinks'] ?? [];

            if (!empty($sides)) {
                foreach ($sides as $side) {
                    $existingSide = $user->cart()->where([
                        'parent_cart_item_id' => $cartItem->id,
                        'food_id' => $side['id'],
                    ])->first();

                    if ($existingSide) {
                        $existingSide->increment('quantity');
                    } else {
                        $user->cart()->create([
                            'food_id' => $side['id'],
                            'parent_cart_item_id' => $cartItem->id,
                            'quantity' => 1,
                        ]);
                    }
                }
            }

            if (!empty($drinks)) {
                foreach ($drinks as $drink) {
                    $existingDrink = $user->cart()->where([
                        'parent_cart_item_id' => $cartItem->id,
                        'food_id' => $drink['id'],
                    ])->first();

                    if ($existingDrink) {
                        $existingDrink->increment('quantity');
                    } else {
                        $user->cart()->create([
                            'food_id' => $drink['id'],
                            'parent_cart_item_id' => $cartItem->id,
                            'quantity' => 1,
                        ]);
                    }
                }
            }
        }

        $payload = $this->cartPayloadForUser($user);

        return response()->json(array_merge([
            'message' => 'Food and add-ons added to cart successfully!',
            'cart_item' => $cartItem->fresh()->load('food'),
        ], $payload));
    }

    public function userCart(Request $request)
    {
        $user = $request->user();
        $payload = $this->cartPayloadForUser($user);

        return response()->json($payload);
    }

    public function removeToCart(Request $request, $foodId)
    {
        $user = $request->user();

        $cartItem = $user->Cart()
            ->where('food_id', $foodId)
            ->whereNull('parent_cart_item_id')
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Food not found in cart.',
            ], 404);
        }

        $cartItem->addons()->delete();
        $cartItem->delete();

        return response()->json([
            'message' => 'Food and its add-ons removed from cart!',
        ]);
    }
}
