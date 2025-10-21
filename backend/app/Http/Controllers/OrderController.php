<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Utils\GcashCheckout;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OrderController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;
    
      public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }
   public function placeOrder(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'location' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);


        $cartItems = CartItem::with('food')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();
        try {
            $total = $cartItems->sum(fn($item) => $item->food->price * $item->quantity);

            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $total,
                'status' => 'pending',
                'latitude'  => $validated['latitude'],
                'longitude'  => $validated['longitude'],
                'location'  => $validated['location'],
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_id' => $item->food_id,
                    'quantity' => $item->quantity,
                    'price' => $item->food->price,
                ]);
            }

            // Try to create GCash checkout
            $checkout = GcashCheckout::createCheckout($order);

            // If checkout fails, it should throw before here
            // So now it's safe to clear cart and commit
            CartItem::where('user_id', $user->id)->delete();
            DB::commit();

           
            Http::post(config('services.websocket.http_url') . "/broadcast/order", [
                'event' => 'create',
                'order' => $order->load('items.food', 'items.food.categories'),
            ]);

            return $checkout;

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserOrder(Request $request)
    {
        $user = $request->user();

        
        $orders = $user->Orders()->with('items.food','items.food.categories')->orderBy('created_at', 'desc')->get();

        if ($orders->isEmpty()) {
            return response()->json(['message' => 'No orders found'], 404);
        }

        return response()->json([
            'orders' => $orders
        ], 200);
    }

     /**
     * Cancel order if still pending
     */
    public function cancelOrder(Request $request, $orderId)
    {
        $user = $request->user();
        $order = $user->Orders()->where('id', $orderId)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order cannot be cancelled'], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        Http::post(config('services.websocket.http_url') ."/broadcast/order", [
            'event' => 'cancelled',
            'order' => $order->load('items'),
        ]);

        return response()->json(['message' => 'Order cancelled successfully', 'order' => $order], 200);
    }

    /**
     * Admin updates order status
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        $this->authorize('isAdmin', Order::class);

        $request->validate([
            'status' => 'required|in:pending,approved,declined,completed'
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        Http::post(config('services.websocket.http_url') ."/broadcast/order", [
            'event' => 'update',
            'user_id' => $order->user->id,
            'order' => $order->load('items.food','items.food.categories'),
        ]);

        return response()->json(['message' => 'Order status updated', 'order' => $order], 200);
    }

    public function updateOrderETC(Request $request, $orderId)
    {
        $this->authorize('isAdmin', Order::class);

        $request->validate([
            'etc' => 'required|numeric'
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->estimated_time_of_completion = $request->etc;
        $order->save();

        Http::post(config('services.websocket.http_url') ."/broadcast/order", [
            'event' => 'update',
            'user_id' => $order->user->id,
            'order' => $order->load('items.food','items.food.categories'),
        ]);

        return response()->json(['message' => 'Order status updated', 'order' => $order], 200);
    }

    public function allOrders(Request $request)
    {
        $this->authorize('isAdmin', Order::class);
        $user = $request->user();

        if ($user && $user->role === "admin") {
            $all_orders = Order::with(['items.food', 'user','items.food.categories'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'orders' => $all_orders
            ], 200);
        }

        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    public function deleteOrder(Order $order){
        
        $this->authorize('isAdmin', Order::class);
        Http::post(config('services.websocket.http_url') ."/broadcast/food", [
            "event" => "delete",
            "order"  => $order
        ]);

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully'], 200);
    }

}
