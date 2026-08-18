// irp-etf 대시보드 서비스워커
// 목적: PWA 설치(Add to Home Screen) 요건 충족 + 오프라인 시 앱 셸 표시
// 주의: /api/krx 요청은 항상 최신 데이터가 필요하므로 캐싱하지 않고 네트워크로 그대로 통과시킨다.

const CACHE_NAME = "irp-etf-shell-v1";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API 요청(KRX 데이터)은 절대 캐싱하지 않고 네트워크로만 처리
  if (url.pathname.startsWith("/api/")) {
    return; // 서비스워커가 가로채지 않음 (기본 네트워크 동작)
  }

  // 앱 셸: 네트워크 우선, 실패 시 캐시 폴백 (오프라인 대응)
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
