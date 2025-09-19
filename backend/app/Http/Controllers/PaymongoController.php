<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymongoSession;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymongoController extends Controller
{
   
    // Verify endpoint (called by frontend when user lands on success page)
    public function verifyByOrder($orderId)
    {
        $session = PaymongoSession::where('order_id', $orderId)->latest()->first();
        if (! $session) {
            return response()->json(['status' => 'no_session'], 404);
        }

        $client = new Client([
            'base_uri' => 'https://api.paymongo.com/v1/',
            'auth' => [env('PAYMONGO_SECRET'), '']
        ]);

        try {
            $res = $client->get("checkout_sessions/{$session->checkout_id}");
            $body = json_decode((string)$res->getBody(), true);

            // look for payments in the session (server-side only)
            $payments = data_get($body, 'data.attributes.payments', []);

            $paid = false;
            // payments may contain entries; check their status
            foreach ($payments as $p) {
                $status = data_get($p, 'attributes.status') ?? data_get($p, 'status');
                if ($status === 'paid' || $status === 'succeeded') {
                    $paid = true;
                    break;
                }
            }

            // fallback: check linked payment_intent status (if present)
            $piStatus = data_get($body, 'data.attributes.payment_intent.attributes.status');
            if (! $paid && $piStatus && in_array($piStatus, ['succeeded', 'paid'])) {
                $paid = true;
            }

            if ($paid) {
                $order = Order::find($orderId);
                if ($order && ! $order->paid_at) {
                    $order->payment_status = 'paid';
                    $order->paid_at = now();
                    $order->save();
                    // do fulfillment tasks here
                }

                return response()->json(['status' => 'paid']);
            }

            // If payment is still processing or not paid:
            return response()->json([
                'status' => 'unpaid',
                'payments' => $payments,
                'payment_intent_status' => $piStatus ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Paymongo verify error: '.$e->getMessage());
            return response()->json(['error' => 'Could not verify payment'], 500);
        }
    }
}
