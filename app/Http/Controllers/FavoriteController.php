<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * List user's favorites
     */
    public function index()
    {
        $favorites = auth()->user()->favorites()->with('menu.category')->get();

        return Inertia::render('Favorites', [
            'favorites' => $favorites
        ]);
    }

    /**
     * Toggle favorite status
     */
    public function toggle(Menu $menu)
    {
        $user = auth()->user();
        
        $favorite = $user->favorites()->where('menu_id', $menu->id)->first();

        if ($favorite) {
            $favorite->delete();
            $status = 'removed';
        } else {
            $user->favorites()->create(['menu_id' => $menu->id]);
            $status = 'added';
        }

        return back()->with('success', "Item $status from favorites");
    }
}
