/*jshint esversion:6 */

const CACHE_NAME = 'static-cache';
const urlsToCache = [
    '.',
    '/controller.html',
    '/manual',
    '/manual.html',
    '/assets/icons/boiler-icon-256.png',
    '/assets/images/off.jpg',
    '/assets/images/on.jpg',
    '/assets/fonts/TECHNOID.TTF',
    '/assets/js/jquery-3.3.1.min.js',
    '/assets/js/sw-init.js',
    '/assets/js/socket.io.slim.js',
    '/assets/manifest-manual.json',
    '/service-worker.js'
];

self.addEventListener('install', (e) => {
    let putincache = caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }).catch(console.error);
    e.waitUntil(putincache);
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    if (!e.request.url.match(location.origin)) return;
    let newRes = caches.open(CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((res) => {
            if (res) {
                console.info(`Serving ${res.url} from cache.`);
                return res;
            }
            return fetch(e.request).then((fetchres) => {
                //cache.put(e.request, fetchres.clone());
                return fetchres;
            });
        });
    }).catch((err) => { console.log('err', err); });
    e.respondWith(newRes);
});