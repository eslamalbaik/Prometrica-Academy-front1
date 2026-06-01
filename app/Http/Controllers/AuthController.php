<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            return response()->json([
                'message' => 'Logged in successfully',
                'user' => [
                    'id' => $user->id,
                    'fullName' => $user->name,
                    'role' => $user->role ?? 'student',
                    'email' => $user->email,
                ]
            ]);
        }

        return response()->json([
            'message' => 'The provided credentials do not match our records.',
            'errors' => [
                'email' => ['The provided credentials do not match our records.']
            ]
        ], 422);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'student',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Account created successfully',
            'user' => [
                'id' => $user->id,
                'fullName' => $user->name,
                'role' => $user->role,
                'email' => $user->email,
            ]
        ], 201);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
