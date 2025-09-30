<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymongoSession;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymongoController extends Controller
{
    public function verifyByOrder($orderId)
    {
        $session = PaymongoSession::where('order_id', $orderId)->latest()->first();
        if (! $session) {
            return response()->json(['status' => 'no_session'], 404);
        }

        $client = new Client([
            'base_uri' => 'https://api.paymongo.com/v1/',
            'auth' => [env('PAYMONGO_SECRET'), ''],
            'verify' => false // ⚠️ only for local dev, remove in production
        ]);

        try {
            $res = $client->get("checkout_sessions/{$session->checkout_id}");
            $body = json_decode((string)$res->getBody(), true);

            // checkout session attributes
            $checkout = data_get($body, 'data.attributes', []);
            $referenceNumber = data_get($checkout, 'reference_number');
            $lineItems       = data_get($checkout, 'line_items', []);
            $billing         = data_get($checkout, 'billing');
            $shipping        = data_get($checkout, 'shipping');

            // look for payments in the session
            $payments = data_get($checkout, 'payments', []);

            $paid = false;
            $gcashRef = null;

            foreach ($payments as $p) {
                $status = data_get($p, 'attributes.status') ?? data_get($p, 'status');

                // Extract GCash reference if present
                $methodType = data_get($p, 'attributes.source.attributes.type');
                if ($methodType === 'gcash') {
                    $gcashRef = data_get($p, 'attributes.source.attributes.details.reference_number');
                }

                if ($status === 'paid' || $status === 'succeeded') {
                    $paid = true;
                }
            }

            // fallback: check linked payment_intent
            $piStatus = data_get($checkout, 'payment_intent.attributes.status');
            if (! $paid && $piStatus && in_array($piStatus, ['succeeded', 'paid'])) {
                $paid = true;
            }

            if ($paid) {
                $order = Order::find($orderId);
                if ($order && ! $order->paid_at) {
                    $order->payment_status = 'paid';
                    $order->paid_at = now();
                    $order->save();
                }

                return response()->json([
                    'status' => 'paid',
                    'reference_number' => $referenceNumber, // PayMongo checkout reference
                    'gcash_reference_number' => $gcashRef,  // Actual GCash ref
                    'checkout_details' => [
                        'line_items' => $lineItems,
                        'billing' => $billing,
                        'shipping' => $shipping,
                    ],
                ]);
            }

            return response()->json([
                'status' => 'unpaid',
                'payments' => $payments,
                'payment_intent_status' => $piStatus ?? null,
                'reference_number' => $referenceNumber,
                'gcash_reference_number' => $gcashRef,
                'checkout_details' => [
                    'line_items' => $lineItems,
                    'billing' => $billing,
                    'shipping' => $shipping,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Paymongo verify error: '.$e->getMessage());
            return response()->json(['error' => 'Could not verify payment'], 500);
        }
    }
}
