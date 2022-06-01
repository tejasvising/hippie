'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "f0ca71f5d155feefcc7bf6c430e42660",
"assets/assets/images/arabicwomen.jpg": "6c2258609752fb5019ac119685d1b573",
"assets/assets/images/call.png": "d02cce976c88e4c8fee5f133220708b0",
"assets/assets/images/design.png": "872bc67c200d7c0576665871b33deaf6",
"assets/assets/images/facebook.png": "f0906d11bb1efffe5a55aaa713112a7d",
"assets/assets/images/instagram.png": "eea4166e17f8457ccca2be24d8726010",
"assets/assets/images/linkedin.png": "50f3637d8ad418066fcf36bb95d3f307",
"assets/assets/images/location.png": "d59f08e0f3dacc939e3777873d5f6a97",
"assets/assets/images/logo.jpg": "f5e592bc428975284250027c68a75bcb",
"assets/assets/images/mail.png": "fe54acae418755bc89ac66bd81d4cf71",
"assets/assets/images/man.jpg": "df0377ca5b62f752933883f71fb0c2d1",
"assets/assets/images/mastercard.png": "3a835acd15909e11dfe7076b24357d89",
"assets/assets/images/measurement.png": "69907b1a36efab501362ceaa44a60643",
"assets/assets/images/modifiedfabrics.png": "35afa212aa283c39638e791cec53740e",
"assets/assets/images/modifiedkids.png": "a9f50f006aa11de041d14e031c3d4a7e",
"assets/assets/images/modifiedmen.png": "07f6642c81c5f74f11d250f7ba2f2f98",
"assets/assets/images/modifiedwomen.png": "3ebabaff52fe6f11ed75428dd6795f84",
"assets/assets/images/paypal.png": "4e3c6fa19c4aba718849c10a5eca9809",
"assets/assets/images/pickup.png": "d2ab11e93b2e5e6a5592cfd082a46216",
"assets/assets/images/scissors.png": "4cf667b475ee57571a32e8b9da284af5",
"assets/assets/images/shop.png": "31eaed99c4f9aa3d98d57ceef0258c63",
"assets/assets/images/twitter.png": "b6eec92860b6ff691760d63e8d6f8ce1",
"assets/assets/images/visa.png": "2c58bc985413940fdb77f28ebe8ef5c4",
"assets/assets/images/women.jpg": "cd4a07f2766120c329fef3cb51d5f304",
"assets/assets/images/youtube.png": "04a8ddbb1f91cd5cd05a9d1eefa56873",
"assets/assets/images/youtube_icon.png": "1339cb55332ec61191b332719835894c",
"assets/FontManifest.json": "5ad9ff4f36e6c8ee48ad3ecb24730db4",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/fonts/Philosopher-Regular.ttf": "af6ea62714f4dc4aff98b14cc8ff23db",
"assets/NOTICES": "fde84f735915d4bda3d39a0a128a8f5d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/line_icons/lib/assets/fonts/LineIcons.ttf": "23621397bc1906a79180a918e98f35b2",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "88d65fce23f3896993fffb790e15cd74",
"/": "88d65fce23f3896993fffb790e15cd74",
"main.dart.js": "36f54f2d9406e82e13436f587cf5dc7d",
"manifest.json": "982c3b2ffe9317418dc7b49f8f86b2a7",
"version.json": "8dee35b730de2b2b5cf3164dc0969417"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
