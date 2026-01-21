self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('royal-dine-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/menu',
                '/reservation',
                '/contact',
                '/build/assets/app.css',
                '/build/assets/app.js',
                '/images/hero.png',
                '/images/butter-chicken.png',
                '/images/biryani.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
