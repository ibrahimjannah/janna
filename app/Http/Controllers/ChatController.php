<?php

namespace App\Http\Controllers;

use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected $aiService;

    public function __construct(AiService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Handle incoming chat messages.
     */
    public function sendMessage(Request $request)
    {

        // Validate input
        $request->validate([
            'message' => 'required|string|max:500',
            'guest_id' => 'required|string|max:100',
        ]);

        try {
            $userMessage = $request->input('message');
            $guestId = $request->input('guest_id');

            // Get response from AI Service
            $aiData = $this->aiService->ask($userMessage, $guestId);

            return response()->json([
                'status' => 'success',
                'message' => $aiData['text'],
                'action' => $aiData['action'] ?? null,
                'items' => $aiData['items'] ?? [],
                'quick_replies' => $aiData['quick_replies'] ?? [],
                'sender' => 'ai',
                'timestamp' => now()->toIso8601String(),
            ]);

        } catch (\Exception $e) {
            Log::error("AI Chat Error: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'The Royal Assistant is momentarily busy. Please try again.',
            ], 500);
        }
    }
}
