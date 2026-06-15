export default async function handler(req, res) {
  // CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { basDd } = req.query;
  if (!basDd) return res.status(400).json({ error: "basDd 파라미터 필요" });

  const API_KEY = process.env.KRX_API_KEY;
  const url = `http://data-dbg.krx.co.kr/svc/apis/etp/etf_bydd_trd?basDd=${basDd}`;

  try {
    const response = await fetch(url, {
      headers: { AUTH_KEY: API_KEY }
    });
    if (!response.ok) throw new Error(`KRX 응답 오류: ${response.status}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
