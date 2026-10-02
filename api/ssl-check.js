// RankVelt API: POST /api/ssl-check
// Body: { domain: "example.com" } (full URLs are accepted and cleaned)
// Opens a TLS connection and reports the certificate: issuer, validity
// window, days remaining, SANs, protocol, and hostname match.

const tls = require('tls');

const TIMEOUT_MS = 8000;

function cleanDomain(input) {
  let d = String(input || '').trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  d = d.split('/')[0].split('?')[0].split('#')[0];
  d = d.split(':')[0];
  d = d.replace(/\.$/, '');
  return d;
}

function isValidHostname(d) {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(d);
}

function hostnameMatches(host, cert) {
  const names = [];
  if (cert.subject && cert.subject.CN) names.push(String(cert.subject.CN).toLowerCase());
  if (cert.subjectaltname) {
    cert.subjectaltname
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.toLowerCase().startsWith('dns:'))
      .forEach((s) => names.push(s.slice(4).toLowerCase()));
  }
  return names.some((name) => {
    if (name === host) return true;
    if (name.startsWith('*.')) {
      const suffix = name.slice(1);
      const head = host.slice(0, host.length - suffix.length);
      return host.endsWith(suffix) && head.length > 0 && !head.includes('.');
    }
    return false;
  });
}

function sanList(cert) {
  if (!cert.subjectaltname) return [];
  return cert.subjectaltname
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.toLowerCase().startsWith('dns:'))
    .map((s) => s.slice(4));
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only.' });
    return;
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const domain = cleanDomain(body.domain || body.url || '');
  if (!domain || !isValidHostname(domain)) {
    res.status(400).json({ ok: false, error: 'Enter a valid domain, like example.com.' });
    return;
  }

  let settled = false;
  const fail = (message) => {
    if (settled) return;
    settled = true;
    res.status(200).json({ ok: false, error: message });
  };

  const socket = tls.connect(
    443,
    domain,
    { servername: domain, rejectUnauthorized: false, timeout: TIMEOUT_MS },
    () => {
      if (settled) return;
      settled = true;
      try {
        const authorized = socket.authorized;
        const authError = socket.authorizationError ? String(socket.authorizationError.message || socket.authorizationError) : null;
        const cert = socket.getPeerCertificate(true) || {};
        const protocol = socket.getProtocol();
        socket.end();

        if (!cert || !cert.valid_to) {
          res.status(200).json({ ok: false, error: 'That server did not present an SSL certificate.' });
          return;
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / 86400000);
        const match = hostnameMatches(domain, cert);
        const expired = daysRemaining < 0;
        const valid = authorized && match && !expired;

        res.status(200).json({
          ok: true,
          domain,
          valid,
          authorized,
          authorizationError: authError,
          hostnameMatch: match,
          issuer: { O: cert.issuer && cert.issuer.O, CN: cert.issuer && cert.issuer.CN },
          subject: { CN: cert.subject && cert.subject.CN },
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
          san: sanList(cert),
          protocol,
        });
      } catch (err) {
        res.status(200).json({ ok: false, error: 'Could not read the certificate from that server.' });
      }
    }
  );

  socket.on('timeout', () => {
    socket.destroy();
    fail('The connection timed out. That server may not support HTTPS on port 443.');
  });
  socket.on('error', (err) => {
    const msg = String((err && err.message) || '');
    if (/ENOTFOUND/.test(msg)) fail('That domain could not be found.');
    else if (/ECONNREFUSED/.test(msg)) fail('The server refused the connection. HTTPS may not be enabled.');
    else if (/certificate/i.test(msg)) fail('The server presented a certificate problem: ' + msg);
    else fail('Could not connect to that server over HTTPS.');
  });
};
