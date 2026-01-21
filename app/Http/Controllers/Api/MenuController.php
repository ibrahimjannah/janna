<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with('category');

        if ($request->has('signature') && $request->signature == 1) {
            $query->where('is_signature', true);
        }

        return response()->json($query->get());
    }
}
