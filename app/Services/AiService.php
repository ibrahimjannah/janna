<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class AiService
{
    /**
     * Send a message to the AI and get a response.
     *
     * @param string $message
     * @param string $guestId
     * @return array
     */
    public function ask(string $message, string $guestId): array
    {
        $messageLower = trim(strtolower($message));


        // --- 1. GREETING & CHIT-CHAT (Highest Priority) ---
        if (str_contains($messageLower, 'how are you') || str_contains($messageLower, 'how are things') || str_contains($messageLower, 'how it going')) {
            return [
                'text' => "I am performing with royal excellence, thank you for your kind inquiry! 😊 The atmosphere here is delightful and the kitchen is preparing some truly magnificent dishes. How may I serve you and your party today?",
                'quick_replies' => [
                    ['text' => "View Selection 🥘", 'message' => "Food Menu"],
                    ['text' => "Book a Table 📅", 'message' => "Book Table"]
                ]
            ];
        }

        if (preg_match('/\b(hi|hello|hey|welcome)\b/i', $messageLower)) {
            return [
                'text' => "Hello, how may I serve you today? 👑 It is a privilege to assist you at Indian Royal Dine. Would you like to view our signature collection, secure a table, or inquire about our **Royal Catering** services?",
                'quick_replies' => [
                    ['text' => "View Menu 🥘", 'message' => "Food Menu"],
                    ['text' => "Book Table 📅", 'message' => "Book Table"],
                    ['text' => "Catering 🎊", 'message' => "Tell me about catering"]
                ]
            ];
        }

        // --- 2. TOPIC GUARDIAN (Strictly Restaurant Related) ---
        $allowedKeywords = [
            'food', 'menu', 'eat', 'hungry', 'price', 'dish', 'curry', 'biryani', 'chicken', 'lamb', 'veg', 'momo', 'salmon', 'tandoor', 'organic', 'vegan', 'plant', 'wellness', 'bowl',
            'book', 'reserve', 'table', 'reservation', 'time', 'hour', 'date',
            'complaint', 'bad', 'issue', 'problem', 'complain', 'feedback', 'wrong',
            'contact', 'address', 'location', 'phone', 'email', 'where', 'call',
            'profile', 'account', 'login', 'signup', 'register', 'setting', 'my orders', 'past order', 'history',
            'checkout', 'pay', 'order', 'cart', 'buy', 'delivery',
            'coupon', 'discount', 'promo', 'code', 'offer',
            'hello', 'hi', 'hey', 'help', 'what can you do', 'who are you', 'heritage', 'tradition', 'story', 'history', 'legacy', 'precision', 'team', 'crew', 'rowing', 'catering', 'party', 'event', 'function'
        ];

        $isTopicRelated = false;
        foreach ($allowedKeywords as $word) {
            if (str_contains($messageLower, $word)) {
                $isTopicRelated = true;
                break;
            }
        }

        // If it's a completely unrelated sentence (more than 2 words), trigger Guardian
        if (!$isTopicRelated && count(explode(' ', $messageLower)) > 2) {
            return [
                'text' => "Welcome! I am the Royal Assistant for **Indian Royal Dine**. 👑 How may I serve you today? I can guide you through our new **Royal Organic** range, our **Plant-Based Perfection** menu, or help you secure a table for a heritage dining experience.",
                'quick_replies' => [
                    ['text' => "Show Menu 🥘", 'message' => "Food Menu"],
                    ['text' => "Organic Selection 🌱", 'message' => "Show me Organic"],
                    ['text' => "Book a Table 📅", 'message' => "Book Table"]
                ]
            ];
        }

        // --- 3. SPECIALIZED INTENTS (Complaints, Menu) ---
        if (str_contains($messageLower, 'complaint') || str_contains($messageLower, 'bad') || str_contains($messageLower, 'wrong') || str_contains($messageLower, 'issue') || str_contains($messageLower, 'problem') || str_contains($messageLower, 'complain')) {
            return [
                'text' => "Your satisfaction is our royal priority. 👑 I am sincerely sorry that we did not meet your expectations today. Please share the details on our guest support page so our management team can resolve this for you immediately.",
                'action' => [
                    'type' => 'NAVIGATE',
                    'url' => '/contact?subject=Complaint',
                    'button_text' => 'Speak to Management 📩'
                ]
            ];
        }

        // --- 3.1 HERITAGE & STORY ---
        if (str_contains($messageLower, 'story') || str_contains($messageLower, 'history') || str_contains($messageLower, 'legacy') || str_contains($messageLower, 'heritage') || str_contains($messageLower, 'tradition') || str_contains($messageLower, 'precision')) {
            return [
                'text' => "Our legacy is built on the **Precision of Taste**. 👑 Inspired by the discipline and teamwork of a professional rowing team, our 'Kitchen Brigade' operates with unparalleled coordination to bring you the majesty of ancient Indian culinary traditions. We believe every dish should be a masterpiece of timing and authentic flavor.",
                'quick_replies' => [
                    ['text' => "See the Menu 🥘", 'message' => "Food Menu"],
                    ['text' => "Our Heritage 🏰", 'message' => "About Us"]
                ]
            ];
        }

        // --- 3.2 CATERING & EVENTS ---
        if (str_contains($messageLower, 'catering') || str_contains($messageLower, 'party') || str_contains($messageLower, 'event') || str_contains($messageLower, 'function') || str_contains($messageLower, 'wedding')) {
            return [
                'text' => "Planning a royal celebration? 🎊 We offer specialized **Party Catering** for events of all sizes. Our new inquiry portal allows you to specify your guest count and event type so we can tailor a menu perfectly for your occasion.",
                'action' => [
                    'type' => 'NAVIGATE',
                    'url' => '/contact?category=party_catering',
                    'button_text' => 'Inquire for Catering 📋'
                ],
                'quick_replies' => [
                    ['text' => "View Catering Menu", 'message' => "Show me menu"],
                    ['text' => "General Support", 'message' => "Contact Us"]
                ]
            ];
        }

        if ($messageLower === 'food menu' || $messageLower === 'show menu' || $messageLower === 'menu' || $messageLower === 'what do you have') {
            $items = Menu::where('is_signature', true)->take(6)->get();
            if ($items->isEmpty()) {
                $items = Menu::take(6)->get();
            }
            
            return [
                'text' => "Welcome to our Royal Menu! 👑 It is my pleasure to present our Chef's Signature Dishes. We now feature a refined **Royal Organic** range and **Plant-Based Perfection** substitutes for a truly bespoke dining experience.",
                'items' => $items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'price' => $item->price,
                        'image' => $item->image ? (str_starts_with($item->image, '/') ? $item->image : asset('storage/' . $item->image)) : '/images/placeholder-food.png',
                        'description' => $item->description,
                        'badge' => $item->is_signature ? 'Signature' : 'Popular'
                    ];
                })->toArray(),
                'quick_replies' => array_merge(
                    Category::all()->take(5)->map(function($cat) {
                        return ['text' => $cat->name, 'message' => "Show me {$cat->name}"];
                    })->toArray(),
                    [['text' => "View Cart 🛒", 'message' => "Go to Cart"]]
                )
            ];
        }

        // --- 4. COUPONS & DISCOUNTS ---
        if (str_contains($messageLower, 'coupon') || str_contains($messageLower, 'promo') || str_contains($messageLower, 'discount') || str_contains($messageLower, 'offer')) {
            // Detect Remove Coupon intent
            if (preg_match('/(remove|clear|delete|cancel)\s+(coupon|code|promo|discount|offer)/i', $messageLower)) {
                return [
                    'text' => "I understand. Would you like me to remove the applied coupon from your royal order? 👑",
                    'action' => [
                        'type' => 'REMOVE_COUPON',
                        'button_text' => 'Remove Coupon 🗑️'
                    ]
                ];
            }

            // Check if there's a specific code mentioned (uppercase alphanumeric, at least 4 chars)
            // We ignore common words like APPLY, CODE, COUPON to avoid premature errors
            if (preg_match('/\b(?!APPLY|CODE|COUPON|PROMO|OFFER\b)[A-Z0-9]{4,}\b/', $message, $matches)) {
                $code = $matches[0];
                return [
                    'text' => "I will attempt to apply the royal coupon code **{$code}** to your order immediately! 👑",
                    'action' => [
                        'type' => 'APPLY_COUPON',
                        'coupon_code' => $code
                    ]
                ];
            }

            // Fetch current cart subtotal
            $subtotal = \App\Models\CartItem::where(auth()->check() ? 'user_id' : 'session_id', auth()->check() ? auth()->id() : session()->getId())
                ->get()
                ->sum(fn($item) => $item->price * $item->quantity);

            if ($subtotal >= 1000) {
                return [
                    'text' => "Magnificent! Your order total is over £1000. 👑 You are eligible for our most prestigious reward: **20% Discount + Free Delivery**! Use code **ROYAL20FREE**.",
                    'quick_replies' => [['text' => "Apply ROYAL20FREE", 'message' => "Apply coupon ROYAL20FREE"]]
                ];
            } elseif ($subtotal >= 500) {
                $diff = 1000 - $subtotal;
                return [
                    'text' => "Excellent choice! You are currently eligible for a **15% Discount** with code **ROYAL15**. 👑 If you add just £{$diff} more to your order, you'll unlock **20% Off and Free Delivery**!",
                    'quick_replies' => [
                        ['text' => "Apply ROYAL15", 'message' => "Apply coupon ROYAL15"],
                        ['text' => "View Menu 🥘", 'message' => "Food Menu"]
                    ]
                ];
            } elseif ($subtotal >= 300) {
                $diff = 500 - $subtotal;
                return [
                    'text' => "A royal feast indeed! You can apply **ROYAL10** for a **10% Discount**. 👑 Add £{$diff} more to reach the **15% Discount** tier!",
                    'quick_replies' => [
                        ['text' => "Apply ROYAL10", 'message' => "Apply coupon ROYAL10"],
                        ['text' => "View Menu 🥘", 'message' => "Food Menu"]
                    ]
                ];
            } elseif ($subtotal >= 100) {
                $diff = 300 - $subtotal;
                return [
                    'text' => "You've unlocked the **ROYAL5** coupon for **5% Off**! 👑 Would you like to add £{$diff} more to your order to unlock the **10% Discount**?",
                    'quick_replies' => [
                        ['text' => "Apply ROYAL5", 'message' => "Apply coupon ROYAL5"],
                        ['text' => "View Menu 🥘", 'message' => "Food Menu"]
                    ]
                ];
            } else {
                $diff = 100 - $subtotal;
                return [
                    'text' => "Welcome to Indian Royal Dine! 👑 We offer exquisite rewards for our guests:\n- £100+ -> **5% Off** (ROYAL5)\n- £300+ -> **10% Off** (ROYAL10)\n- £500+ -> **15% Off** (ROYAL15)\n- £1000+ -> **20% Off + Free Delivery** (ROYAL20FREE)\n\nYou are just £{$diff} away from your first royal discount!",
                    'quick_replies' => [
                        ['text' => "View Menu 🥘", 'message' => "Food Menu"],
                        ['text' => "Apply ROYAL5", 'message' => "Apply coupon ROYAL5"]
                    ]
                ];
            }
        }

        // --- 5. NAVIGATION ---
        if (str_contains($messageLower, 'profile') || str_contains($messageLower, 'account') || str_contains($messageLower, 'setting')) {
            return ['text' => "I can guide you to your royal profile page.", 'action' => ['type' => 'NAVIGATE', 'url' => '/profile', 'button_text' => 'My Profile 👤']];
        }
        if (str_contains($messageLower, 'signup') || str_contains($messageLower, 'register')) {
            return ['text' => "Become a member of the Royal Dining family!", 'action' => ['type' => 'NAVIGATE', 'url' => '/register', 'button_text' => 'Signup Now 📝']];
        }
        if (str_contains($messageLower, 'history') || str_contains($messageLower, 'my order')) {
            return ['text' => "You can view all your previous royal feasts here.", 'action' => ['type' => 'NAVIGATE', 'url' => '/orders', 'button_text' => 'My Orders 📦']];
        }
        if (str_contains($messageLower, 'contact') || str_contains($messageLower, 'location')) {
            return ['text' => "Find us at Crown Plaza, 123 Royal Street.\n📞 +44 20 1234 5678", 'action' => ['type' => 'NAVIGATE', 'url' => '/contact', 'button_text' => 'Contact Us ✉️']];
        }
        if (str_contains($messageLower, 'book') || str_contains($messageLower, 'reserve') || str_contains($messageLower, 'reservation') || str_contains($messageLower, 'booking')) {
            return ['text' => "Secure your table for a royal dining experience.", 'action' => ['type' => 'NAVIGATE', 'url' => '/reservation', 'button_text' => 'Book a Table 📅']];
        }
        if (str_contains($messageLower, 'cart') || str_contains($messageLower, 'card')) {
            return ['text' => "I can guide you to your royal cart.", 'action' => ['type' => 'NAVIGATE', 'url' => '/cart', 'button_text' => 'View Cart 🛒']];
        }

        // --- 5. SEARCH & PROBING ---
        if (str_contains($messageLower, 'category') || str_contains($messageLower, 'show me') || str_contains($messageLower, 'food') || str_contains($messageLower, 'list')) {
            $categories = Category::all();
            foreach ($categories as $cat) {
                if (str_contains($messageLower, strtolower($cat->name))) {
                    $items = Menu::where('category_id', $cat->id)->take(4)->get();
                    return [
                        'text' => "Our **{$cat->name}** selection is prepared with authentic royal spice blends and the finest ingredients.",
                        'items' => $items->map(fn($i) => [
                            'id'=>$i->id, 
                            'name'=>$i->name, 
                            'price'=>$i->price, 
                            'image'=>$i->image ? (str_starts_with($i->image, '/') ? $i->image : asset('storage/'.$i->image)) : '/images/placeholder-food.png', 
                            'description'=>$i->description,
                            'badge' => $i->is_signature ? 'Signature' : 'Popular'
                        ])->toArray(),
                        'quick_replies' => [['text' => "Back to Menu", 'message' => "Food Menu"]]
                    ];
                }
            }
        }

        $matchingItems = Menu::where('name', 'like', "%{$messageLower}%")
            ->orWhere('description', 'like', "%{$messageLower}%")
            ->take(6)
            ->get();

        if ($matchingItems->isNotEmpty() && strlen($messageLower) > 3) {
            return [
                'text' => count($matchingItems) > 1 
                    ? "I found several options for **{$messageLower}**! Here are some of our finest selections:" 
                    : "I found the perfect **{$matchingItems->first()->name}** for you! 👑",
                'items' => $matchingItems->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'image' => $item->image ? (str_starts_with($item->image, '/') ? $item->image : asset('storage/' . $item->image)) : '/images/placeholder-food.png',
                    'description' => $item->description,
                    'badge' => $item->is_signature ? 'Signature' : 'Popular'
                ])->toArray(),
                'quick_replies' => [
                    ['text' => "Show Full Menu 🥘", 'message' => "Food Menu"],
                    ['text' => "Book Table 📅", 'message' => "Book Table"]
                ]
            ];
        }

        // --- 6. FUZZY MATCHING (Levenshtein) ---
        $words = explode(' ', $messageLower);
        $allItems = Menu::all();
        
        foreach ($words as $word) {
            if (strlen($word) < 4) continue;
            
            foreach ($allItems as $item) {
                // Check if the user's word matches any word in the item name
                $itemWords = explode(' ', strtolower($item->name));
                foreach ($itemWords as $itemWord) {
                    if (strlen($itemWord) < 4) continue;
                    
                    $dist = levenshtein($word, $itemWord);
                    if ($dist >= 1 && $dist <= 2) {
                        return [
                            'text' => "I couldn't find exactly what you typed... Did you mean our famous **{$item->name}**?",
                            'quick_replies' => [
                                ['text' => "Yes, show {$item->name} ✅", 'message' => "Show me {$item->name}"],
                                ['text' => "No, show menu 🥘", 'message' => "Food Menu"]
                            ]
                        ];
                    }
                }
            }
        }

        // --- 7. FINAL FALLBACK ---
        return [
            'text' => "I am here to serve! I can help you find food, manage your account, or book a table. What would you like to do?",
            'quick_replies' => [
                ['text' => "See Menu 🥘", 'message' => "Food Menu"],
                ['text' => "Contact Us ✉️", 'message' => "Contact"],
                ['text' => "My Profile 👤", 'message' => "My Profile"]
            ]
        ];
    }
}
