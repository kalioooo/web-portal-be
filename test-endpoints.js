#!/usr/bin/env node
/**
 * Quick test: 4 endpoints + docs.
 * Run with: node test-endpoints.js
 * (Start server first: npm run dev)
 */
const BASE = 'http://localhost:4000';

async function test(name, fn) {
  try {
    await fn();
    console.log('  OK', name);
    return true;
  } catch (e) {
    console.log('  FAIL', name, '-', e.message);
    return false;
  }
}

async function main() {
  console.log('Testing endpoints (server must be running on 4000)...\n');

  let passed = 0;

  // 1. Health
  const ok1 = await test('GET /health', async () => {
    const r = await fetch(BASE + '/health');
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    if (!j.ok) throw new Error('ok not true');
  });
  if (ok1) passed++;

  // 2. List projects
  const ok2 = await test('GET /api/projects', async () => {
    const r = await fetch(BASE + '/api/projects');
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    if (!Array.isArray(j)) throw new Error('not array');
  });
  if (ok2) passed++;

  // 3. Create project
  let id;
  const ok3 = await test('POST /api/projects', async () => {
    const r = await fetch(BASE + '/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Project', slug: 'test-' + Date.now() }),
    });
    if (r.status !== 201) throw new Error(r.status + ' ' + (await r.text()));
    const j = await r.json();
    if (!j.id) throw new Error('no id');
    id = j.id;
  });
  if (ok3) passed++;

  // 4. Get project by id
  const ok4 = await test('GET /api/projects/:id', async () => {
    if (!id) throw new Error('no id from create');
    const r = await fetch(BASE + '/api/projects/' + id);
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    if (j.id !== id) throw new Error('wrong id');
  });
  if (ok4) passed++;

  // Docs
  const ok5 = await test('GET /api-docs.json (Swagger spec)', async () => {
    const r = await fetch(BASE + '/api-docs.json');
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    if (!j.openapi || !j.paths['/api/projects']) throw new Error('invalid spec');
  });
  if (ok5) passed++;

  console.log('\n' + passed + '/5 passed.');
  process.exit(passed === 5 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
