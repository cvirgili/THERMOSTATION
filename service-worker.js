/*jshint esversion:6 */
//'/assets/js/socket.io.slim.js',

const CACHE_NAME = 'static-cache';
const urlsToCache = [
    '/manual.html',
    '/scheduler.html',
    '/assets/images/off.jpg',
    '/assets/images/on.jpg',
    '/assets/fonts/TECHNOID.TTF',
    '/assets/js/jquery-3.3.1.min.js',
    '/assets/js/sw-init.js',
    '/assets/js/swipe-horizontal.js',
    '/pickerjs/picker.css',
    '/pickerjs/picker.js',
    '/assets/manifest-manual.json'
];

self.addEventListener('install', (e) => {
    let putincache = caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }).catch(console.error);
    e.waitUntil(putincache);
    self.skipWaiting();
});
/*
self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    if (!e.request.url.match(location.origin)) return;
    let newRes = caches.open(CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((res) => {
            if (res) {
                console.info(`Serving ${res.url} from cache.`);
                return res;
            }
            return e.request.url;
            //return fetch(e.request).then((fetchres) => {
            //cache.put(e.request, fetchres.clone());
            //return fetchres;
            //});
        });
    }).catch((err) => { console.log('err', err); });
    e.respondWith(newRes);
});*/
self.addEventListener('fetch', function(event) {
    if (!event.request.url.match(location.origin)) return;
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    //cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});