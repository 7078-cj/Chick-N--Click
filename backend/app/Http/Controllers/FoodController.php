<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Http\Requests\StoreFoodRequest;
use App\Http\Requests\UpdateFoodRequest;
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
         return Food::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFoodRequest $request)
    {
        $validated = $request->validate([
            'thumbnail' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,gif', 'max:51200'], 
            'food_name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'], 
            'available' => ['required', 'boolean'], 
            'description' => ['required', 'string', 'max:100'],
        ]);

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filePath = $file->store('thumbnails', 'public');
            $validated['thumbnail'] = $filePath;
        }

        $created_food = Food::create($validated);
        return $created_food;
    }

    /**
     * Display the specified resource.
     */
    public function show(Food $food)
    {
       return  $food;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFoodRequest $request, Food $food)
    {
        $validated = $request->validate([
            'thumbnail' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,gif', 'max:51200'], 
            'food_name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'], 
            'available' => ['required', 'boolean'], 
            'description' => ['required', 'string', 'max:100'],
        ]);

        if ($request->hasFile('thumbnail') && $request['thumbnail'] != null) {
            $file = $request->file('thumbnail');
            $filePath = $file->store('Thumbnails', 'public'); 
            $validated['thumbnail'] = $filePath;
        }else{
            $validated['thumbnail'] = $food->thumbnail;
        }

        $food->update($validated);

        return $food;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Food $food)
    {
        $food->delete();

        return ["message" => "post deleted"];
    }
}
