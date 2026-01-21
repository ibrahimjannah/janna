<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Customers/Index', [
            'customers' => User::where('is_admin', false)->latest()->get()
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->is_admin) {
            return redirect()->back()->with('error', 'Cannot delete an administrator.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Customer deleted successfully!');
    }
}
