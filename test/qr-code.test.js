const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const { EventEmitter } = require('node:events');

function fixture() {
  let handler;
  let call;
  const context = { module: { exports: {} }, URL, console: { error() {} }, require: name => {
    if (name === 'express') return { Router: () => ({ get: (_path, fn) => { handler = fn; } }) };
    if (name === 'qrcode') return { toFileStream: (...args) => { call = args; } };
    throw new Error(`Unexpected dependency: ${name}`);
  } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../api/qr-code.js'), 'utf8'), context, { filename: path.join(__dirname, '../api/qr-code.js') });
  return { request: query => { const response = new EventEmitter(); handler({ query }, response); return { call, response }; } };
}

test('defaults to production activation without an empty user_code', () => {
  const { call, response } = fixture().request({});
  assert.equal(call[0], response);
  assert.equal(call[1], 'https://auth.streamotion.com.au/activate');
});

test('staging activation encodes user codes as query data', () => {
  const { call } = fixture().request({ auth0Env: 'staging', user_code: 'A B&other=value#fragment' });
  const url = new URL(call[1]);
  assert.equal(url.host, 'auth-staging.streamotion.com.au');
  assert.equal(url.searchParams.get('user_code'), 'A B&other=value#fragment');
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.hash, '');
});

test('passes requested QR symbol and rendering options to the encoder', () => {
  const { call } = fixture().request({ errorCorrectionLevel: 'H', version: '5', width: '300',
    margin: '0', scale: '2', dark: '#000000', light: '#ffffff', deflateLevel: '7', deflateStrategy: '2' });
  const options = call[2];
  assert.equal(options.errorCorrectionLevel, 'H');
  assert.equal(options.version, '5');
  assert.equal(options.width, '300');
  assert.equal(options.margin, '0');
  assert.equal(options.color.dark, '#000000');
  assert.equal(options.rendererOpts.deflateLevel, '7');
});

test('encoder failure responds with a server error', () => {
  const { call, response } = fixture().request({});
  let status;
  let body;
  response.status = value => { status = value; return response; };
  response.send = value => { body = value; return response; };
  response.emit('error', new Error('fixture encoder failure'));
  assert.equal(status, 500);
  assert.equal(body, 'Server error');
});

test('stream failure after headers closes the response without sending another status', () => {
  const { response } = fixture().request({});
  response.headersSent = true;
  let destroyed = false;
  response.destroy = () => { destroyed = true; };
  response.status = () => assert.fail('headers already sent');
  response.emit('error', new Error('late stream failure'));
  assert.equal(destroyed, true);
});
