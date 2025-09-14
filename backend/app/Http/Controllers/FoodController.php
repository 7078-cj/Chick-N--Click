<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FoodController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
        return Food::with('categories')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'thumbnail'   => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'], 
            'food_name'   => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric', 'min:0'], 
            'available'   => ['required', 'boolean'], 
            'description' => ['required', 'string', 'max:255'],
            'categories'  => ['array', 'nullable'],   // array of category IDs
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filePath = $file->store('thumbnails', 'public');
            $validated['thumbnail'] = $filePath;
        }

        // Create food
        $food = Food::create($validated);

        // Sync categories if provided
        if (!empty($validated['categories'])) {
            $food->categories()->sync($validated['categories']);
        }

        return $food->load('categories');
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

        // Sync categories if provided
        if (isset($validated['categories'])) {
            $food->categories()->sync($validated['categories']);
        }else{
            $food->categories()->sync([]);
        }

        return $food->load('categories');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Food $food)
    {
        // Delete thumbnail if exists
        if ($food->thumbnail && Storage::disk('public')->exists($food->thumbnail)) {
            Storage::disk('public')->delete($food->thumbnail);
        }

        $food->delete();

        return response()->json(['message' => 'Food deleted successfully'], 200);
    }
}
