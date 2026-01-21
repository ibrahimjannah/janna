<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display user's addresses
     */
    public function index()
    {
        $addresses = auth()->user()->addresses()->latest()->get();

        return Inertia::render('Addresses/Index', [
            'addresses' => $addresses
        ]);
    }

    /**
     * Store a new address
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'postcode' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();

        $address = Address::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'address' => $address,
        ]);
    }

    /**
     * Update an address
     */
    public function update(Request $request, Address $address)
    {
        // Verify ownership
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'postcode' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $address->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'address' => $address,
        ]);
    }

    /**
     * Delete an address
     */
    public function destroy(Address $address)
    {
        // Verify ownership
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $address->delete();

        return redirect()->back()->with('success', 'Address deleted successfully');
    }

    /**
     * Set address as default
     */
    public function setDefault(Address $address)
    {
        // Verify ownership
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Default address updated',
        ]);
    }
}
