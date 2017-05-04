// Need to use the polyfill because the Cache API is not yet 
// fully supported in all browsers.

importScripts('/js/serviceworker-cache-polyfill.js');

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('darinGeorgiev').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/styles.css',
                '/js/scripts.js',
                '/imgs/profile.jpg'
            ]);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});