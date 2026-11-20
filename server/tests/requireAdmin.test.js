const test = require('node:test');
const assert = require('node:assert/strict');
const requireAdmin = require('../middleware/requireAdmin');

function invoke(key, authorization) {
  const previous = process.env.PARKING_ADMIN_API_KEY;
  if (key === undefined) delete process.env.PARKING_ADMIN_API_KEY;
  else process.env.PARKING_ADMIN_API_KEY = key;
  const response = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  let nextCalled = false;
  try {
    requireAdmin({ get: () => authorization }, response, () => { nextCalled = true; });
    return { status: response.statusCode, nextCalled };
  } finally {
    if (previous === undefined) delete process.env.PARKING_ADMIN_API_KEY;
    else process.env.PARKING_ADMIN_API_KEY = previous;
  }
}

const validKey = 'a'.repeat(40);
test('fails closed without configured key', () => assert.deepEqual(invoke(undefined, 'Bearer ' + validKey), { status: 503, nextCalled: false }));
test('rejects weak configured key', () => assert.equal(invoke('short', 'Bearer short').status, 503));
test('requires bearer header', () => assert.equal(invoke(validKey, undefined).status, 401));
test('rejects invalid key', () => assert.equal(invoke(validKey, 'Bearer wrong').status, 403));
test('allows correct key', () => assert.deepEqual(invoke(validKey, 'Bearer ' + validKey), { status: 200, nextCalled: true }));
