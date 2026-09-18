const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const router = require('../api/qr-code');
const handler = router.stack[0].route.stack[0].handle;

function response() {
  const stream = new PassThrough();
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.status = code => { stream.statusCode = code; return stream; };
  stream.send = body => { stream.end(body); return stream; };
  stream.body = () => Buffer.concat(chunks);
  return stream;
}

test('the real encoder produces a PNG with requested dimensions', async () => {
  const res = response();
  const finished = new Promise((resolve, reject) => { res.on('finish', resolve); res.on('error', reject); });
  handler({ query: { width: '256', user_code: 'ABCD-1234' } }, res);
  await finished;
  const png = res.body();
  assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(png.readUInt32BE(16), 256);
  assert.equal(png.readUInt32BE(20), 256);
});

test('a real QR capacity failure returns 500 instead of an unhandled stream error', async t => {
  t.mock.method(console, 'error', () => {});
  const res = response();
  let emitted;
  res.on('error', err => { emitted = err; });
  handler({ query: { version: '1', errorCorrectionLevel: 'H', user_code: 'A'.repeat(200) } }, res);
  // QR validation is synchronous even though successful PNG encoding streams.
  assert.ok(emitted instanceof Error);
  assert.equal(res.statusCode, 500);
  assert.equal(res.body().toString(), 'Server error');
});
