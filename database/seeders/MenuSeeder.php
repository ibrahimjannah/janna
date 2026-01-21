<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data to avoid duplicates and ensure clean reorganization
        Menu::truncate();
        Category::truncate();

        $categories = [
            'Small Plates' => Category::create(['name' => 'Small Plates', 'slug' => 'small-plates']),
            'Royal Tandoor' => Category::create(['name' => 'Royal Tandoor', 'slug' => 'royal-tandoor']),
            'Signature Curries' => Category::create(['name' => 'Signature Curries', 'slug' => 'signature-curries']),
            'Authentic Biryani' => Category::create(['name' => 'Authentic Biryani', 'slug' => 'biryani']),
            'Royal Organic' => Category::create(['name' => 'Royal Organic', 'slug' => 'organic']),
            'Plant-Based Perfection' => Category::create(['name' => 'Plant-Based Perfection', 'slug' => 'plant-based']),
            'Royal Wellness' => Category::create(['name' => 'Royal Wellness', 'slug' => 'wellness']),
            'Sides & Breads' => Category::create(['name' => 'Sides & Breads', 'slug' => 'sides-breads']),
            'Desserts' => Category::create(['name' => 'Desserts', 'slug' => 'desserts']),
        ];

        $items = [
            // Small Plates
            ['category' => 'Small Plates', 'name' => 'Veg/Chicken Momo', 'description' => 'Steamed dumplings served with homemade chutney.', 'price' => 9.95, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => true],
            ['category' => 'Small Plates', 'name' => 'Onion Pakora', 'description' => 'Chopped onions in spices, gram flour coated, deep-fried.', 'price' => 7.25, 'image' => '/images/onion-bhaji.png', 'spice_level' => 1, 'is_signature' => false],
            ['category' => 'Small Plates', 'name' => 'Squid Nicobar', 'description' => 'Fresh squid lightly marinated in herbs & spices, deep-fried.', 'price' => 8.45, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => true],
            ['category' => 'Small Plates', 'name' => 'Chicken Ru Ru', 'description' => 'Spiced chicken with fresh coriander in special batter.', 'price' => 7.25, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => false],
            ['category' => 'Small Plates', 'name' => 'Prawn Puri', 'description' => 'Flavored king prawns served on savoury bread.', 'price' => 8.45, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => false],

            // Royal Tandoor
            ['category' => 'Royal Tandoor', 'name' => 'Rapti Salmon', 'description' => 'Lightly spiced salmon fillets cooked in the clay oven.', 'price' => 15.95, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => true],
            ['category' => 'Royal Tandoor', 'name' => 'Nawabi Paneer', 'description' => 'Cottage cheese with peppers, onions, and Rajah special sauce.', 'price' => 13.95, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => false],
            ['category' => 'Royal Tandoor', 'name' => 'Sheesh Kebab', 'description' => 'Minced lamb with green chilli and chopped coriander.', 'price' => 13.95, 'image' => '/images/tandoori.png', 'spice_level' => 3, 'is_signature' => false],
            ['category' => 'Royal Tandoor', 'name' => 'Tandoori Lamb Chops', 'description' => 'Barbecued New Zealand lamb ribs, marinated in royal spices.', 'price' => 15.50, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => true],

            // Signature Curries
            ['category' => 'Signature Curries', 'name' => 'Murgh Madura', 'description' => 'Chicken in rich tomato sauce with curry leaves & green chilli.', 'price' => 13.45, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => true],
            ['category' => 'Signature Curries', 'name' => 'Royal Butter Chicken', 'description' => 'Barbecued chicken in creamy cashew nut sauce.', 'price' => 14.99, 'image' => '/images/butter-chicken.png', 'spice_level' => 1, 'is_signature' => true],
            ['category' => 'Signature Curries', 'name' => 'Lamb Chilli', 'description' => 'Barbecue lamb in hot tomato sauce with fresh chillies.', 'price' => 13.95, 'image' => '/images/hero.png', 'spice_level' => 3, 'is_signature' => false],
            ['category' => 'Signature Curries', 'name' => 'Chicken Tikka Masala', 'description' => 'Chargrilled chicken in a rich masala sauce.', 'price' => 15.99, 'image' => '/images/chicken-tikka-masala.png', 'spice_level' => 2, 'is_signature' => true],
            ['category' => 'Signature Curries', 'name' => 'Bulsari Salmon Curry', 'description' => 'Spiced salmon over charcoal with a mild Rajah sauce.', 'price' => 15.95, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => false],

            // Authentic Biryani
            ['category' => 'Authentic Biryani', 'name' => 'Hyderabadi Chicken Biryani', 'description' => 'Fragrant rice dish with aromatic spices and tender chicken.', 'price' => 13.99, 'image' => '/images/biryani.png', 'spice_level' => 2, 'is_signature' => true],
            ['category' => 'Authentic Biryani', 'name' => 'Royal Lamb Biryani', 'description' => 'Tender lamb slow-cooked with aromatic basmati rice.', 'price' => 14.95, 'image' => '/images/biryani.png', 'spice_level' => 2, 'is_signature' => false],
            ['category' => 'Authentic Biryani', 'name' => 'King Prawn Biryani', 'description' => 'Chargrilled king prawns layered with spicy rice.', 'price' => 15.95, 'image' => '/images/biryani.png', 'spice_level' => 2, 'is_signature' => false],

            // Royal Organic
            ['category' => 'Royal Organic', 'name' => 'Organic Chicken Date', 'description' => 'Organic chicken breast with cashewnuts, honey, and dates.', 'price' => 16.95, 'image' => '/images/hero.png', 'spice_level' => 0, 'is_signature' => true],
            ['category' => 'Royal Organic', 'name' => 'Organic Lamb Rose', 'description' => 'Tender organic lamb with rose petals and roasted red peppers.', 'price' => 17.95, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => true],
            ['category' => 'Royal Organic', 'name' => 'Organic Simi Aloo', 'description' => 'Organic beans and potatoes with five spice mix.', 'price' => 10.95, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => false],

            // Plant-Based Perfection
            ['category' => 'Plant-Based Perfection', 'name' => 'Plant Chilli', 'description' => 'Plant-based chicken in hot & sweet sauce with bell peppers.', 'price' => 13.45, 'image' => '/images/hero.png', 'spice_level' => 2, 'is_signature' => false],
            ['category' => 'Plant-Based Perfection', 'name' => 'Plant Biryani', 'description' => 'Entirely vegan aromatic rice with fragrant spices and rose water.', 'price' => 14.95, 'image' => '/images/biryani.png', 'spice_level' => 2, 'is_signature' => false],

            // Royal Wellness
            ['category' => 'Royal Wellness', 'name' => 'Lanzaret Bowl', 'description' => 'Salmon, poppy seed rice, and avocado kuchumber salad.', 'price' => 17.95, 'image' => '/images/hero.png', 'spice_level' => 0, 'is_signature' => true],

            // Sides & Breads
            ['category' => 'Sides & Breads', 'name' => 'Shahi Baigan', 'description' => 'Aubergines cooked with onions, ginger, and garlic.', 'price' => 10.50, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => false],
            ['category' => 'Sides & Breads', 'name' => 'Bhindi Bhaji', 'description' => 'Fresh okra stir-fried in tomato and cumin.', 'price' => 10.50, 'image' => '/images/hero.png', 'spice_level' => 1, 'is_signature' => false],
            ['category' => 'Sides & Breads', 'name' => 'Garlic Naan', 'description' => 'Freshly baked leavened flatbread with garlic.', 'price' => 3.99, 'image' => '/images/garlic-naan.png', 'spice_level' => 0, 'is_signature' => false],
            ['category' => 'Sides & Breads', 'name' => 'Peshwari Naan', 'description' => 'Baked with sultanas and nuts for a sweet finish.', 'price' => 4.25, 'image' => '/images/hero.png', 'spice_level' => 0, 'is_signature' => false],

            // Desserts
            ['category' => 'Desserts', 'name' => 'Royal Gulab Jamun', 'description' => 'Deep-fried milk dumplings in sugar syrup.', 'price' => 5.95, 'image' => '/images/hero.png', 'spice_level' => 0, 'is_signature' => false],
            ['category' => 'Desserts', 'name' => 'Mango Kulfi', 'description' => 'Traditional Indian ice cream with mango pulp.', 'price' => 6.50, 'image' => '/images/hero.png', 'spice_level' => 0, 'is_signature' => false],
        ];

        foreach ($items as $item) {
            Menu::create([
                'category_id' => $categories[$item['category']]->id,
                'name' => $item['name'],
                'description' => $item['description'],
                'price' => $item['price'],
                'image' => $item['image'],
                'spice_level' => $item['spice_level'],
                'is_signature' => $item['is_signature'],
            ]);
        }
    }
}
