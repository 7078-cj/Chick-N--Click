<?php

namespace App\Models;

use App\Models\Cart;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    /** @use HasFactory<\Database\Factories\FoodFactory> */
    use HasFactory;

    protected $fillable = [
        'thumbnail',
        'food_name',
        'price',
        'available',
        'description'
    ];

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }

}
