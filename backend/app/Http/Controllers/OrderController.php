<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class OrderController extends Controller implements HasMiddleware
{

    
      public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }
   public function placeOrder(Request $request)
    {
        $user = $request->user();

       
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
            ]);

            
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_id' => $item->food_id,
                    'quantity' => $item->quantity,
                    'price' => $item->food->price,
                ]);
            }

           
            CartItem::where('user_id', $user->id)->delete();

            DB::commit();
            return response()->json(['message' => 'Order placed successfully', 'order' => $order->load('items')], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }

    public function getUserOrder(Request $request)
    {
        $user = $request->user();

        
        $orders = $user->Orders()->with('items.food')->orderBy('created_at', 'desc')->get();

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

        return response()->json(['message' => 'Order cancelled successfully', 'order' => $order], 200);
    }

    /**
     * Admin updates order status
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,declined,completed'
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order], 200);
    }

    public function allOrders(Request $request)
    {
        $user = $request->user();

        if ($user && $user->role === "admin") {
            $all_orders = Order::with(['items.food', 'user'])
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

}
