<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymongoSession extends Model
{
     protected $fillable = ['checkout_id', 'order_id'];
}
