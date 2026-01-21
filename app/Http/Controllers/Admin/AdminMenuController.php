<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMenuController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Menu/Index', [
            'menus' => Menu::with('category')->get(),
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'spice_level' => 'required|integer|min:0|max:3',
            'is_signature' => 'required|boolean',
        ]);

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu item added successfully!');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'spice_level' => 'required|integer|min:0|max:3',
            'is_signature' => 'required|boolean',
        ]);

        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu item updated successfully!');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->back()->with('success', 'Menu item deleted successfully!');
    }
}
