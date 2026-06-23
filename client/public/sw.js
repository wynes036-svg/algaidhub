// Minimal service worker - just enables PWA install, no caching interference
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
// No fetch handler - let all requests pass through normally
