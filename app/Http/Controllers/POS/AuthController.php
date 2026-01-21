<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Display POS login form
     */
    public function create()
    {
        return Inertia::render('POS/Login');
    }

    /**
     * Handle POS login
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Check if user has POS access (staff role)
            $user = Auth::user();
            $staffRole = $user->staffRole;

            if (!$staffRole) {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'You do not have POS access.',
                ]);
            }

            return redirect()->intended(route('pos.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Handle POS logout
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('pos.login');
    }
}
