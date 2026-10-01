// Vercel serverless API route.
// Place this file at: api/dispatch-worker.js  (repo root, next to package.json)
//
// What it does: the website's Start button calls this route, and it triggers
// the GitHub Actions worker (which does the heavy crawling on GitHub's free
// runners, since Vercel functions can only run ~60 seconds).
//
// SECURITY: only someone who knows WORKER_TRIGGER_SECRET can start a run.
// Keep the tool page public for SEO, but never share the key. Without it,
// strangers could burn through your free GitHub Actions minutes.
//
// Required Vercel env vars (Project Settings -> Environment Variables):
//   GITHUB_TOKEN           - GitHub personal access token (classic, scopes: repo, workflow)
//                            or fine-grained token with Actions: read and write on this repo
//   GITHUB_REPO            - e.g. "ahmad/rankvelt-site"  (owner/repo format)
//   WORKER_TRIGGER_SECRET  - any long random string, e.g. from: openssl rand -hex 24

const WORKFLOW_FILE = 'email-worker.yml';
const GIT_REF = 'main'; // change if your default branch is different

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { mode, sheetId, tab, limit, key } = req.body || {};

  const secret = process.env.WORKER_TRIGGER_SECRET;
  if (!secret || key !== secret) {
    return res.status(403).json({ error: 'Wrong trigger key' });
  }

  if (!['extract', 'verify'].includes(mode)) {
    return res.status(400).json({ error: 'mode must be extract or verify' });
  }
  if (!sheetId || typeof sheetId !== 'string') {
    return res.status(400).json({ error: 'sheetId is required' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    return res.status(500).json({ error: 'Server not configured (GITHUB_TOKEN / GITHUB_REPO missing)' });
  }

  const gh = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        ref: GIT_REF,
        inputs: {
          mode,
          sheet: sheetId,
          tab: tab && typeof tab === 'string' ? tab : 'Websites',
          limit: limit ? String(limit) : '0',
        },
      }),
    }
  );

  if (gh.status !== 204) {
    const detail = (await gh.text()).slice(0, 300);
    return res.status(502).json({ error: 'GitHub dispatch failed', detail });
  }

  return res.json({
    ok: true,
    message:
      mode === 'extract'
        ? 'Extractor started. Emails will appear in your Google Sheet as they are found.'
        : 'Verifier started. Results will appear in the Verified tab of your sheet.',
  });
};
