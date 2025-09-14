<?php

namespace App\Models;

use App\Models\CartItem;
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
        return $this->hasMany(CartItem::class);
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_food');
    }

}
