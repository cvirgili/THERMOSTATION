const CACHE_NAME = 'static-cache';
const urlsToCache = [
    '/home',
    '/assets/manifest.json',
    '/assets/fonts/Techno LCD.ttf',
    '/assets/style/style.css',
    '/assets/js/check-remote.js',
    '/assets/js/jquery-3.3.1.min.js',
    '/assets/js/swipe-horizontal.js',
    '/assets/js/temp-diagram.js'
];

self.addEventListener('install', (e) => {
    let putincache = caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }).catch(console.log);

    e.waitUntil(putincache);
});

self.addEventListener('fetch', (e) => {
    console.log(location.origin);
    if (!e.request.url.match(location.origin)) return;
    let newRes = caches.open(CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((res) => {
            if (res) {
                console.log(`Serving ${res.url} from cache.`);
                return res;
            }
            console.log('res', res);
            return fetch(e.request).then((fetchres) => {
                cache.put(e.request, fetchres.clone());
                return fetchres;
            });
        });
    }).catch((err) => { console.log('err', err); });
    e.respondWith(newRes);
});