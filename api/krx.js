const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { basDd } = req.query;

  // 형식 검증: 8자리 숫자만 허용
  if (!basDd || !/^\d{8}$/.test(basDd)) {
    return res.status(400).json({ error: "basDd는 YYYYMMDD 8자리 숫자여야 합니다" });
  }

  const API_KEY = process.env.KRX_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "KRX_API_KEY 환경변수 없음" });

  const options = {
    hostname: "data-dbg.krx.co.kr",
    path: `/svc/apis/etp/etf_bydd_trd?basDd=${basDd}`,
    method: "GET",
    headers: { AUTH_KEY: API_KEY }
  };

  try {
    const data = await new Promise((resolve, reject) => {
      const req2 = https.request(options, (r) => {
        let body = "";
        r.on("data", chunk => body += chunk);
        r.on("end", () => {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error("JSON 파싱 실패: " + body.slice(0, 300))); }
        });
      });
      req2.on("error", reject);
      req2.end();
    });

    // CDN 캐싱: 같은 날짜 요청은 1시간 동안 캐시 (KRX 호출 횟수 절감)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
