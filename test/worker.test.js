import test from 'node:test';
import assert from 'node:assert/strict';

for (const variant of ['', '-no-otp']) {
  test(`Worker ${variant || 'OTP default'}: demo registration and admin boundaries`, async () => {
    const { default: worker } = await import(`../src/worker${variant}.js`);
    const env = { ADMIN_EMAIL: 'admin@example.com', ADMIN_PASSWORD: 'local-test-only-password' };
    const request = (path, method = 'GET', body, auth = false) => worker.fetch(
      new Request(`https://demo.example${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: `Basic ${btoa(`${env.ADMIN_EMAIL}:${env.ADMIN_PASSWORD}`)}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      }), env,
    );
    const health = await (await request('/api/health')).json();
    assert.match(health.supabase, /demo mode/);
    assert.equal((await request('/api/products')).status, 401);
    assert.equal((await request('/api/products', 'GET', undefined, true)).status, 200);
    assert.equal((await request('/config.json')).status, 403);
    const portal = await (await request('/')).text();
    assert.match(portal, /Customer Activation Portal/);
    assert.match(await (await request('/admin')).text(), /<html/);
    assert.equal((await request('/missing')).status, 404);
    assert.equal((await request('/api/activate', 'POST', {})).status, 400);
    const details = { serialNumber: 'SN-DEMO-001', name: 'Test Customer', phone: '+15550100000', email: 'test@example.com' };
    const otp = await (await request('/api/otp/request', 'POST', details)).json();
    assert.equal(otp.success, true);
    assert.match(otp.simulatedCode, /^\d{6}$/);
    const wrong = await request('/api/otp/verify', 'POST', { serialNumber: details.serialNumber, code: 'wrong' });
    assert.equal(wrong.status, 401);
    const activated = await (await request('/api/otp/verify', 'POST', { serialNumber: details.serialNumber, code: otp.simulatedCode })).json();
    assert.equal(activated.success, true);
    assert.equal(activated.data.status, 'active');
    assert.ok(activated.data.licenseKey);
    assert.equal((await request('/api/activate', 'POST', details)).status, 409);
    const replay = await request('/api/otp/verify', 'POST', { serialNumber: details.serialNumber, code: otp.simulatedCode });
    assert.equal(replay.status, 404);
    // Record the existing direct-activation policy in both variants.
    const direct = await (await request('/api/activate', 'POST', { ...details, serialNumber: 'SN-DEMO-002' })).json();
    assert.equal(direct.success, true);
  });
}
