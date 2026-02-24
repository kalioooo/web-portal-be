/**
 * Quick test of server URL — run while the backend is running (npm start).
 * Usage: node test-server-url.js
 */
const BASE = process.env.API_BASE_URL || 'http://localhost:4000';

async function test(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? path : '/' + path}`;
  const label = `${options.method || 'GET'} ${path}`;
  try {
    const res = await fetch(url, { method: options.method || 'GET', ...options });
    const text = await res.text();
    const body = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
    console.log(`${label} → ${res.status}`, body != null ? JSON.stringify(body).slice(0, 120) : '');
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    console.log(`${label} → ERROR`, err.message);
    return { ok: false, error: err.message };
  }
}

(async () => {
  console.log('Testing base URL:', BASE);
  await test('/health');
  await test('/api/projects');
  console.log('Done.');
})();
