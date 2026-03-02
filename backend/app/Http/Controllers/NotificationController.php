<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
class NotificationController extends Controller
{

    use AuthorizesRequests;
        
        public static function middleware()
        {
            return [
                new Middleware('auth:sanctum')
            ];
        }
    /**
     * Display a listing of the authenticated user's notifications.
     */
    public function index(Request $request)
    {
        // Get the authenticated user via token
        $user = $request->user();

        // Return only this user's notifications
        $notifications = $user->notifications()->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $notifications,
        ]);
    }

    /**
     * Display the specified notification, only if it belongs to the authenticated user.
     */
    public function show(Request $request, Notification $notification)
    {
        $user = $request->user();

        // Check if the notification belongs to this user
        if ($notification->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to this notification.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $notification,
        ]);
    }

    // Other methods (create, store, update, destroy) can also validate $user->id if needed
}