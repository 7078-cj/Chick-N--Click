<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FoodController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum',except: ['index', 'show'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all foods with categories, ordered by category name then food name
        $foods = Food::with(['categories' => function($query) {
            $query->orderBy('name', 'asc');
        }])
        ->get()
        ->sortBy(function($food) {
            // Use first category's name as primary sort key
            return $food->categories->first()?->name ?? '';
        })
        ->values();

        return response()->json($foods);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $this->authorize('isAdmin', Food::class);

            $validated = $request->validate([
                'thumbnail'   => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
                'food_name'   => ['required', 'string', 'max:255'],
                'price'       => ['required', 'numeric', 'min:0'],
                'available'   => ['required', 'boolean'],
                'description' => ['required', 'string', 'max:255'],
                'categories'  => ['array', 'nullable'],
            ]);

            if ($request->hasFile('thumbnail')) {
                $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
            }

            $food = Food::create($validated);

            if (!empty($validated['categories'])) {
                $food->categories()->sync($validated['categories']);
            }

            Http::post(config('services.websocket.http_url') . "/broadcast/food", [
                "event" => "created",
                "food"  => $food->load('categories'),
            ]);

            return response()->json($food->load('categories'), 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Unauthorized: only admins can perform this action',
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Food $food)
    {
        return $food->load('categories');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Food $food)
    {
        $this->authorize('isAdmin', Food::class);
        $validated = $request->validate([
            'thumbnail'   => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'], 
            'food_name'   => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric', 'min:0'], 
            'available'   => ['required', 'boolean'], 
            'description' => ['required', 'string', 'max:255'],
            'categories'  => ['array', 'nullable'], 
        ]);

        // Handle thumbnail update
        if ($request->hasFile('thumbnail')) {
            // Delete old file if exists
            if ($food->thumbnail && Storage::disk('public')->exists($food->thumbnail)) {
                Storage::disk('public')->delete($food->thumbnail);
            }
            $file = $request->file('thumbnail');
            $filePath = $file->store('thumbnails', 'public');
            $validated['thumbnail'] = $filePath;
        } else {
            $validated['thumbnail'] = $food->thumbnail;
        }

        $food->update($validated);
        $food->refresh();

        // Sync categories if provided
        if (isset($validated['categories'])) {
            $food->categories()->sync($validated['categories']);
        }else{
            $food->categories()->sync([]);
        }

        Http::post(config('services.websocket.http_url') ."/broadcast/food", [
            "event" => "updated",
            "food"  => $food->load('categories')
        ]);

        return $food->load('categories');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Food $food)
    {
         $this->authorize('isAdmin', Food::class);
        // Delete thumbnail if exists
        if ($food->thumbnail && Storage::disk('public')->exists($food->thumbnail)) {
            Storage::disk('public')->delete($food->thumbnail);
        }

        $foodData = $food->load('categories');
        $food->delete();

        Http::post(config('services.websocket.http_url') ."/broadcast/food", [
            "event" => "deleted",
            "food"  => $foodData
        ]);

        return response()->json(['message' => 'Food deleted successfully'], 200);
    }

    public function drinks(Request $request)
    {
        $drinksAndAddons = Food::whereHas('categories', function ($query) {
                $query->whereIn('name', ['Drinks', 'Addons']);
            }, '=', 2) 
            ->with('categories')
            ->get();

        return response()->json($drinksAndAddons);
    }

    public function sides(Request $request)
    {
        
        $sides = Food::whereHas('categories', function ($query) {
                $query->whereIn('name', ['Sides', 'Addons']);
            }, '=', 2) 
        ->with('categories')
        ->get();

        return response()->json($sides);
    }
}
