const crypto = require('node:crypto');

// Server-side administrative credential. Never put this value in client-side code.
function requireAdmin(req, res, next) {
  const configuredKey = process.env.PARKING_ADMIN_API_KEY;
  if (!configuredKey || configuredKey.length < 32) {
    return res.status(503).json({ error: 'Administrative writes are not configured' });
  }
  const authorization = req.get('authorization') || '';
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match) return res.status(401).json({ error: 'Authentication required' });
  const provided = Buffer.from(match[1], 'utf8');
  const expected = Buffer.from(configuredKey, 'utf8');
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
}
module.exports = requireAdmin;
