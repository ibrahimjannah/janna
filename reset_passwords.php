<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$users = User::whereIn('email', ['admin@indianroyaldine.co.uk', 'cashier@indianroyaldine.com'])->get();
foreach($users as $user) {
    $user->password = Hash::make('password123');
    $user->save();
    echo "Reset password for {$user->email}\n";
}
