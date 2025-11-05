<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;

class FoodController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show', 'drinks', 'sides'])
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $foods = Food::with(['categories' => function($query) {
            $query->orderBy('name', 'asc');
        }])
        ->get()
        ->sortBy(function($food) {
            if (!$food->categories || $food->categories->isEmpty()) {
                return '';
            }
            return $food->categories->first()->name ?? '';
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

            $validated['thumbnail'] = null;

            if ($request->hasFile('thumbnail')) {
                $file = $request->file('thumbnail');

                if (!$file->isValid()) {
                    return response()->json(['message' => 'Invalid file upload.'], 400);
                }

                try {
                    // Create Cloudinary instance with SSL disabled for Windows
                    $client = new \GuzzleHttp\Client(['verify' => false]);
                    
                    $cloudinary = new \Cloudinary\Cloudinary([
                        'cloud' => [
                            'cloud_name' => config('filesystems.disks.cloudinary.cloud'),
                            'api_key' => config('filesystems.disks.cloudinary.key'),
                            'api_secret' => config('filesystems.disks.cloudinary.secret'),
                        ],
                        'url' => ['secure' => true],
                    ]);
                    
                    $cloudinary->configuration->cloud->api_http_client = $client;
                    
                    $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                        'folder' => 'foods',
                    ]);

                    $validated['thumbnail'] = $result['secure_url'];
                    
                    Log::info('Cloudinary upload successful', [
                        'url' => $result['secure_url'],
                        'public_id' => $result['public_id']
                    ]);
                } catch (\Throwable $e) {
                    Log::error('Cloudinary upload failed: ' . $e->getMessage());
                    return response()->json([
                        'message' => 'Failed to upload image.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            }

            $food = Food::create($validated);

            if (!empty($validated['categories'])) {
                $food->categories()->sync($validated['categories']);
            }

            $websocketUrl = config('services.websocket.http_url');
            if ($websocketUrl) {
                try {
                    Http::post($websocketUrl . "/broadcast/food", [
                        "event" => "created",
                        "food"  => $food->load('categories'),
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Websocket broadcast failed: ' . $e->getMessage());
                }
            }

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
            Log::error('Food store error: ' . $e->getMessage());
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
                $file = $request->file('thumbnail');

                if (!$file->isValid()) {
                    return response()->json(['message' => 'Invalid file upload.'], 400);
                }

                try {
                    // Create Cloudinary instance
                    $client = new \GuzzleHttp\Client(['verify' => false]);
                    
                    $cloudinary = new \Cloudinary\Cloudinary([
                        'cloud' => [
                            'cloud_name' => config('filesystems.disks.cloudinary.cloud'),
                            'api_key' => config('filesystems.disks.cloudinary.key'),
                            'api_secret' => config('filesystems.disks.cloudinary.secret'),
                        ],
                        'url' => ['secure' => true],
                    ]);
                    
                    $cloudinary->configuration->cloud->api_http_client = $client;

                    // Delete old image if exists
                    if ($food->thumbnail && str_contains($food->thumbnail, 'res.cloudinary.com')) {
                        try {
                            $urlPath = parse_url($food->thumbnail, PHP_URL_PATH);
                            $pathParts = explode('/', $urlPath);
                            $publicIdWithExt = end($pathParts);
                            $publicId = pathinfo($publicIdWithExt, PATHINFO_FILENAME);
                            
                            // Find the folder (usually "foods")
                            $folderIndex = array_search('foods', $pathParts);
                            if ($folderIndex !== false) {
                                $folder = $pathParts[$folderIndex];
                                $cloudinary->uploadApi()->destroy($folder . '/' . $publicId);
                            }
                        } catch (\Exception $e) {
                            Log::warning('Failed to delete old Cloudinary image: ' . $e->getMessage());
                        }
                    }

                    // Upload new image
                    $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                        'folder' => 'foods',
                    ]);

                    $validated['thumbnail'] = $result['secure_url'];
                } catch (\Throwable $e) {
                    Log::error('Cloudinary upload failed: ' . $e->getMessage());
                    return response()->json([
                        'message' => 'Failed to upload image.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            } else {
                $validated['thumbnail'] = $food->thumbnail;
            }

            $food->update($validated);
            $food->refresh();

            if (isset($validated['categories'])) {
                $food->categories()->sync($validated['categories']);
            } else {
                $food->categories()->sync([]);
            }

            $websocketUrl = config('services.websocket.http_url');
            if ($websocketUrl) {
                try {
                    Http::post($websocketUrl . "/broadcast/food", [
                        "event" => "updated",
                        "food"  => $food->load('categories')
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Websocket broadcast failed: ' . $e->getMessage());
                }
            }

            return response()->json($food->load('categories'), 200);

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
            Log::error('Food update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Food $food)
    {
        try {
            $this->authorize('isAdmin', Food::class);

            // Delete from Cloudinary if URL exists
            if ($food->thumbnail && str_contains($food->thumbnail, 'res.cloudinary.com')) {
                try {
                    $client = new \GuzzleHttp\Client(['verify' => false]);
                    
                    $cloudinary = new \Cloudinary\Cloudinary([
                        'cloud' => [
                            'cloud_name' => config('filesystems.disks.cloudinary.cloud'),
                            'api_key' => config('filesystems.disks.cloudinary.key'),
                            'api_secret' => config('filesystems.disks.cloudinary.secret'),
                        ],
                        'url' => ['secure' => true],
                    ]);
                    
                    $cloudinary->configuration->cloud->api_http_client = $client;

                    $urlPath = parse_url($food->thumbnail, PHP_URL_PATH);
                    $pathParts = explode('/', $urlPath);
                    $publicIdWithExt = end($pathParts);
                    $publicId = pathinfo($publicIdWithExt, PATHINFO_FILENAME);
                    
                    $folderIndex = array_search('foods', $pathParts);
                    if ($folderIndex !== false) {
                        $folder = $pathParts[$folderIndex];
                        $cloudinary->uploadApi()->destroy($folder . '/' . $publicId);
                    }
                } catch (\Exception $e) {
                    Log::warning('Failed to delete Cloudinary image: ' . $e->getMessage());
                }
            }

            $foodData = $food->load('categories');
            $food->delete();

            $websocketUrl = config('services.websocket.http_url');
            if ($websocketUrl) {
                try {
                    Http::post($websocketUrl . "/broadcast/food", [
                        "event" => "deleted",
                        "food"  => $foodData,
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Websocket broadcast failed: ' . $e->getMessage());
                }
            }

            return response()->json(['message' => 'Food deleted successfully'], 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Unauthorized: only admins can perform this action',
            ], 403);
        } catch (\Exception $e) {
            Log::error('Food destroy error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
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