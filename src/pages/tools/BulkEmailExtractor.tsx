// RankVelt tool page: Bulk Email Extractor + Verifier (100% free, no paid APIs)
// Place at: src/pages/tools/BulkEmailExtractor.tsx
// Add a route for it (e.g. /tools/bulk-email-extractor) and a card on the /tools hub.

import { useState } from 'react';

type Mode = 'extract' | 'verify';

export default function BulkEmailExtractor() {
  const [sheetInput, setSheetInput] = useState('');
  const [tab, setTab] = useState('Websites');
  const [mode, setMode] = useState<Mode>('extract');
  const [limit, setLimit] = useState('');
  const [triggerKey, setTriggerKey] = useState(
    () => (typeof localStorage !== 'undefined' ? localStorage.getItem('rv-worker-key') || '' : '')
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function sheetIdFrom(input: string): string {
    const m = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : input.trim();
  }

  async function start() {
    const sheetId = sheetIdFrom(sheetInput);
    if (!sheetId) {
      setIsError(true);
      setMessage('Please paste your Google Sheet link or Sheet ID first.');
      return;
    }
    if (!triggerKey.trim()) {
      setIsError(true);
      setMessage('Please enter your private trigger key.');
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem('rv-worker-key', triggerKey.trim());
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/dispatch-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          sheetId,
          tab: tab.trim() || 'Websites',
          limit: limit.trim() || '0',
          key: triggerKey.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      setIsError(false);
      setMessage(data.message + ' You can close this page, the sheet keeps updating on its own.');
    } catch (e: any) {
      setIsError(true);
      setMessage(e.message || 'Something went wrong starting the worker.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Bulk Email Extractor + Verifier</h1>
      <p className="mt-3 text-gray-600">
        Paste a Google Sheet full of websites, press Start, and this tool crawls every site,
        pulls emails from contact pages, and writes them back into your sheet, row by row.
        Then run Verify to check which emails are real. Free forever, no paid APIs, no signup.
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">Google Sheet link or ID</label>
        <input
          value={sheetInput}
          onChange={(e) => setSheetInput(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
        <label className="mt-3 block text-sm font-medium">
          Trigger key <span className="font-normal text-gray-400">(private, only you know this)</span>
        </label>
        <input
          type="password"
          value={triggerKey}
          onChange={(e) => setTriggerKey(e.target.value)}
          placeholder="Your private trigger key"
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          The page is public for SEO, but nobody can start a run without your key. Saved only in your own browser.
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Share the sheet with the service account email as Editor (one time setup, see guide below).
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Tab name</label>
            <input
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="extract">Extract emails</option>
              <option value="verify">Verify emails</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Limit per run (optional)</label>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))}
              placeholder="0 = all"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={start}
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? 'Starting...' : mode === 'extract' ? 'Start Extraction' : 'Start Verification'}
        </button>

        {message && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border bg-gray-50 p-6">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>Make a Google Sheet with one website per row in column A (header: Website, Emails, Status).</li>
          <li>Paste the sheet link above and press Start. The worker runs on free cloud runners.</li>
          <li>Every 100 websites it pauses briefly so no IP gets blocked. Emails appear in your sheet as they are found.</li>
          <li>Stop anytime. Press Start again and it resumes exactly where it left off, nothing is repeated.</li>
          <li>Switch to Verify mode to check each email: syntax, MX records, and a real mailbox check.</li>
        </ol>
        <h2 className="mt-6 text-lg font-semibold">One time setup</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>Create a free Google Cloud service account and download its JSON key.</li>
          <li>Share your sheet with the service account email as an Editor.</li>
          <li>Add the JSON key as a GitHub secret named GOOGLE_SERVICE_ACCOUNT_JSON.</li>
          <li>Add GITHUB_TOKEN and GITHUB_REPO in Vercel project settings.</li>
        </ol>
        <p className="mt-4 text-sm text-gray-500">
          Full step by step guide with screenshots checklist is in the repo at email-lead-tool/SETUP-GUIDE.md
        </p>
      </div>
    </div>
  );
}
