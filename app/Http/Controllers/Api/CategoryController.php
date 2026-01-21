<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::with('menus')->get());
    }

    public function show(Category $category)
    {
        return response()->json($category->load('menus'));
    }
}
