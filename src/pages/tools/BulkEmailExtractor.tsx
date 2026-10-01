// RankVelt tool page: Bulk Email Extractor + Verifier (100% free, no paid APIs)
// Place at: src/pages/tools/BulkEmailExtractor.tsx
// Styled to match the RankVelt dark theme (same shell as Tools.tsx).

import { useState } from 'react';
import { Sparkles, MailSearch, ShieldCheck } from 'lucide-react';

type Mode = 'extract' | 'verify';

const inputCls =
  'mt-1 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary/50';

const labelCls =
  'block text-[11px] font-black uppercase tracking-[0.18em] text-white/50';

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
    <main className="min-h-screen bg-[#050505] pb-24 pt-40 text-white sm:pt-44">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[390px] w-[390px] rounded-full bg-primary/[0.08] blur-[145px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[360px] w-[360px] rounded-full bg-purple-500/[0.08] blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <Sparkles size={13} />
            Free RankVelt Tool
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            Bulk Email <span className="text-gradient-gold">Extractor</span> + Verifier
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
            Paste a Google Sheet full of websites, press Start, and this tool crawls every
            site, pulls emails from contact pages, and writes them back into your sheet, row
            by row. Then run Verify to check which emails are real. Free forever, no paid
            APIs, no signup.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MailSearch size={20} />
              </span>
              <h2 className="text-xl font-black text-white">Start a run</h2>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Google Sheet link or ID</label>
              <input
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className={inputCls}
              />
            </div>

            <div className="mt-4">
              <label className={labelCls}>
                Trigger key <span className="font-medium normal-case tracking-normal text-white/30">(private, only you know this)</span>
              </label>
              <input
                type="password"
                value={triggerKey}
                onChange={(e) => setTriggerKey(e.target.value)}
                placeholder="Your private trigger key"
                className={inputCls}
              />
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                The page is public for SEO, but nobody can start a run without your key.
                Saved only in your own browser. Share the sheet with the service account
                email as Editor (one time setup, see guide below).
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Tab name</label>
                <input
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                  className={`${inputCls} [&>option]:bg-[#0a0a0a]`}
                >
                  <option value="extract">Extract emails</option>
                  <option value="verify">Verify emails</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Limit per run</label>
                <input
                  value={limit}
                  onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))}
                  placeholder="0 = all"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              onClick={start}
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Starting...' : mode === 'extract' ? 'Start Extraction' : 'Start Verification'}
            </button>

            {message && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                  isError
                    ? 'border-red-500/30 bg-red-500/[0.07] text-red-300'
                    : 'border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-300'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={20} />
              </span>
              <h2 className="text-xl font-black text-white">How it works</h2>
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Make a Google Sheet with one website per row in column A (header: Website, Emails, Status).</li>
              <li>Paste the sheet link above and press Start. The worker runs on free cloud runners.</li>
              <li>Every 100 websites it pauses briefly so no IP gets blocked. Emails appear in your sheet as they are found.</li>
              <li>Stop anytime. Press Start again and it resumes exactly where it left off, nothing is repeated.</li>
              <li>Switch to Verify mode to check each email: syntax, MX records, and a real mailbox check.</li>
            </ol>

            <h3 className="mt-8 text-lg font-black text-white">One time setup</h3>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-white/60">
              <li>Create a free Google Cloud service account and download its JSON key.</li>
              <li>Share your sheet with the service account email as an Editor.</li>
              <li>Add the JSON key as a GitHub secret named GOOGLE_SERVICE_ACCOUNT_JSON.</li>
              <li>Add GITHUB_TOKEN, GITHUB_REPO and WORKER_TRIGGER_SECRET in Vercel project settings.</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
