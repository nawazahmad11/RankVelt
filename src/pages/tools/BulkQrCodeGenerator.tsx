// META: title="Free Bulk QR Code Generator: Create Many QR Codes at Once" (max 60 chars, include target keyword)
// META: description="Generate QR codes in bulk free: paste a list or upload CSV, download all as PNG. No signup, everything in your browser." (max 160 chars, include target keyword)

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Download,
  QrCode,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';

const BULK_QR_FAQS = [
  {
    q: 'How do I generate QR codes in bulk?',
    a: 'Paste one URL or line of text per line into the box above, or upload a CSV file (the first column of each row becomes one code). Pick a size and colors, then press Generate QR Codes. Your codes appear in a grid below, ready to download one by one or all at once as PNG files.',
  },
  {
    q: 'Is this bulk QR code generator really free?',
    a: 'Yes. There is no signup, no watermark, and no limit hidden behind a paywall. Up to 50 codes are generated per batch, which covers most packaging, event, and print runs. Everything happens in your browser, so your list of URLs never leaves your computer.',
  },
  {
    q: 'Do QR codes expire?',
    a: 'Static QR codes, like the ones this tool makes, do not expire. The pattern encodes your text or URL directly, so it keeps working as long as the destination itself works. What can break is the link behind the code: if the page is deleted or the domain lapses, the scan leads nowhere. For long lived campaigns, point codes at URLs you control so you can redirect them later if needed.',
  },
  {
    q: 'Can I track how many people scan my QR codes?',
    a: 'Not with a static QR code alone, because the code is just a picture of your link and no tracking happens inside it. If you need scan counts, point the code at a redirect URL you control and watch the visits in your analytics, or add UTM parameters to the destination URL. Many businesses use one redirect per placement, such as one for flyers and one for packaging, so they can compare performance.',
  },
  {
    q: 'What size should my QR codes be for print?',
    a: 'Download the 512 px version for anything headed to a printer, since small files turn blurry when enlarged. On paper, a code should be at least 2 cm (about 0.8 inches) wide for a short URL, and larger for long URLs because denser codes are harder for cameras to read. A handy rule: the comfortable scanning distance is roughly ten times the width of the printed code.',
  },
  {
    q: 'Can I use brand colors instead of black and white?',
    a: 'Yes, and the color pickers above let you do exactly that. Keep strong contrast with a dark code on a light background, because cameras struggle with light codes on dark backgrounds or two similar tones. Always test the final colors with two or three different phones before printing a large batch.',
  },
  {
    q: 'What is the difference between a QR code and a barcode?',
    a: 'A QR code stores much more data, including full URLs, and can be scanned from any angle by any smartphone camera. A traditional barcode stores a short string of characters and is built for scanners at checkouts and warehouses. Use QR codes when a person needs to scan with a phone, and barcodes when a system needs to track inventory items.',
  },
  {
    q: 'The codes did not generate. What should I check?',
    a: 'This tool loads its QR engine from a public CDN, so an offline connection, a strict ad blocker, or a firewall can block it. If you see a loading error, check your connection, allow scripts from cdnjs.cloudflare.com, and press Retry. If only some codes look wrong, check for typos in those lines and regenerate.',
  },
];

const QR_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
const MAX_CODES = 50;

type QrItem = { id: number; text: string };
type LibStatus = 'loading' | 'ready' | 'error';
type QRCodeCtor = new (
  el: HTMLElement,
  opts: {
    text: string;
    width: number;
    height: number;
    colorDark: string;
    colorLight: string;
    correctLevel: number;
  },
) => unknown;

function getQRCodeCtor(): QRCodeCtor | undefined {
  return (window as unknown as { QRCode?: QRCodeCtor }).QRCode;
}

function parseLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function parseCsvRows(text: string): string[] {
  const rows: string[] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const endField = () => {
    row.push(field);
    field = '';
  };
  const endRow = () => {
    endField();
    const first = row.map((c) => c.trim()).find((c) => c.length > 0);
    if (first) rows.push(first);
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      endField();
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      endRow();
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) endRow();
  return rows;
}

function loadQrLib(setStatus: (s: LibStatus) => void) {
  if (getQRCodeCtor()) {
    setStatus('ready');
    return;
  }
  const existing = document.querySelector<HTMLScriptElement>('script[data-qrcodejs]');
  if (existing) {
    existing.addEventListener('load', () => setStatus('ready'), { once: true });
    existing.addEventListener('error', () => setStatus('error'), { once: true });
    return;
  }
  const s = document.createElement('script');
  s.src = QR_LIB_URL;
  s.async = true;
  s.dataset.qrcodejs = 'true';
  s.onload = () => setStatus('ready');
  s.onerror = () => setStatus('error');
  document.body.appendChild(s);
}

function codeToDataUrl(container: HTMLDivElement | null): string | null {
  if (!container) return null;
  const img = container.querySelector('img');
  const src = img?.getAttribute('src');
  if (src) return src;
  const canvas = container.querySelector('canvas');
  if (canvas) {
    try {
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  }
  return null;
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function QrCodeCell({
  text,
  size,
  dark,
  light,
  register,
}: {
  text: string;
  size: number;
  dark: string;
  light: string;
  register: (el: HTMLDivElement | null) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = innerRef.current;
    const Ctor = getQRCodeCtor();
    if (!el || !Ctor) return;
    el.innerHTML = '';
    try {
      new Ctor(el, {
        text,
        width: size,
        height: size,
        colorDark: dark,
        colorLight: light,
        correctLevel: 0,
      });
    } catch {
      el.innerHTML = '';
    }
  }, [text, size, dark, light]);
  return (
    <div
      ref={register}
      className="flex items-center justify-center overflow-hidden rounded-lg p-3"
      style={{ backgroundColor: light }}
    >
      <div ref={innerRef} className="leading-none" />
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] bg-black/20">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-white">{f.q}</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5">
              <p className="leading-relaxed text-white/75">{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BulkQrCodeArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What Is a Bulk QR Code Generator?</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A bulk QR code generator creates many QR codes in one go instead of making them one at a
            time. You feed it a list of URLs, product links, or short lines of text, and it returns a
            matching QR code for every entry. A standard qr code generator handles a single code; a qr
            code bulk generator is built for the moment you need ten, fifty, or more.
          </p>
          <p>
            The use cases are practical. An online store prints a unique code on every product package
            that links to that item's manual. An event organizer makes one code per ticket tier. A
            restaurant chain makes one code per branch for its review page. Doing any of these with a
            single code tool means repeating the same clicks dozens of times and inviting copy paste
            mistakes.
          </p>
          <p>
            This bulk qr code generator free tool keeps the whole batch consistent: same size, same
            colors, same file format. Consistency matters because a mixed batch, some codes tiny, some
            low contrast, some exported differently, creates scanning failures that are hard to trace
            later.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Business value</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why Businesses Generate QR Codes in Bulk
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The business case is time. Manually creating, downloading, and renaming fifty QR codes can
            eat an entire afternoon, and every manual step is a chance to attach the wrong code to the
            wrong product. Bulk generation turns that into a two minute job: prepare the list once,
            generate once, download once.
          </p>
          <p>
            It also improves accuracy. When the list comes from a spreadsheet export, the mapping
            between code and destination is documented before a single pixel is drawn. That paper trail
            is exactly what you want when a retailer asks which code belongs on which box six months
            later.
          </p>
          <p>
            There is a marketing angle too. Unique codes per placement let you learn what works: the
            code on the receipt versus the code on the window decal can point to different landing
            pages, so you see which placement earns scans. Static codes cannot count scans by
            themselves, but distinct destination URLs can, which the FAQ below explains.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Step by step</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Generate QR Codes in Bulk With This Tool
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start with a clean list. Put one URL or line of text on each line, and double check that
            every URL starts with https:// so phones open it directly instead of showing a warning. If
            your list lives in a spreadsheet, save it as CSV and upload it: the tool reads the first
            column of each row, which is where most people keep the URL.
          </p>
          <p>
            Next, choose size and colors. The 128 px size is fine for quick on screen checks, 256 px
            suits most digital uses, and 512 px is the right pick for anything headed to a printer. Keep
            the code dark and the background light; scanners read contrast, not beauty.
          </p>
          <p>
            Press Generate QR Codes and review the grid. Scan two or three codes with your own phone
            before you download anything: catching a typo now saves a reprint later. Then download each
            PNG individually or use Download All to save the whole batch in one sequence of downloads.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Do QR codes expire</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Do QR Codes Expire?</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            This is the most asked question about QR codes, and the short answer is no: static QR codes
            do not expire. The black and white pattern is simply your text encoded as geometry, so there
            is nothing to renew, no subscription keeping it alive, and no server that can switch it off.
            A code you generate today will still scan in ten years.
          </p>
          <p>
            What can expire is the destination. If the code points to a product page that you later
            delete, a campaign page that you take down, or a domain that you let lapse, the code still
            scans perfectly and then lands on an error. The failure looks like a broken code, but the
            code itself is fine.
          </p>
          <p>
            The fix is ownership. Point bulk codes at URLs you control, ideally short redirect links on
            your own domain, so you can repoint them later without reprinting. And keep a simple
            spreadsheet that maps each code to its destination; when a link changes in two years, you
            will know exactly which printed materials are affected.
          </p>
          <p>
            Be wary of services that sell "dynamic" QR codes with monthly fees: those codes point at the
            vendor's servers, so they stop working the day you stop paying. For most print runs, a free
            static code you generated yourself is the safer long term asset.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Design rules</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Size, Color, and Contrast: Rules That Keep Codes Scannable
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Scanners need contrast and quiet space. Keep a clear margin around every code, roughly the
            width of four modules (the little squares), and never let text, logos, or page edges crowd
            it. This generator bakes each code on a clean background so the quiet zone travels with the
            file.
          </p>
          <p>
            Size follows data. A short URL produces a sparse, forgiving code; a long URL with tracking
            parameters produces a dense one that needs to be printed larger to stay readable. That is why
            the tool offers three sizes: match the size to the longest URLs in your batch, not the
            shortest. If half your batch has long links, generate everything at 512 px.
          </p>
          <p>
            Color is where most batches go wrong. Cameras expect dark modules on a light background, so
            keep it that way even when brand guidelines tempt you toward inverted or tonal designs. If
            you must use brand colors, test with several phones in real lighting, including a budget
            Android, before you commit to print.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Avoid these</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common Mistakes When Making QR Codes in Bulk
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The classic mistake is pointing every code at the homepage. A scanner who wanted the setup
            manual and lands on a generic homepage will not hunt for it; they will close the tab. Deep
            link each code to the exact page the scanner expects, and name your list rows so the mapping
            stays obvious.
          </p>
          <p>
            The second mistake is skipping the test scan. In a batch of fifty, one typo is almost
            guaranteed, and the wrong code always ends up on the most visible package. Scan every code,
            or at least a random sample plus every code that was typed by hand rather than exported from
            a system.
          </p>
          <p>
            The third is hostile placement: codes on curved bottles where they warp, on glossy foil that
            reflects the flash, or in basements with no signal where the landing page cannot load. A QR
            code is a bridge to the internet; both ends of the bridge need to work. Walk the placement
            yourself with a phone before the print run.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Print checklist</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          A Print-Ready Checklist Before You Send Files to the Printer
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Use the 512 px downloads for print and place them at a sensible physical size: at least 2 cm
            wide for short URLs, larger for dense codes. Do one test print at real size on the real stock
            and scan it before the full run; screens lie about print sharpness, and paper texture can
            soften edges.
          </p>
          <p>
            Tell your printer the codes must stay sharp edged: no heavy recompression, no artistic blur,
            and enough ink density for solid dark modules. If the design calls for the code on a colored
            panel, keep the panel light and the quiet zone intact, and ask for a proof you can scan.
          </p>
          <p>
            Finally, archive the batch. Save the PNG files with meaningful names, keep the source list,
            and note the date and campaign. Six months from now, when someone asks for the code from the
            spring flyer, you will thank yourself.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">QR vs barcode</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          QR Codes or Barcodes: Which Do You Need?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            People often search for a bulk barcode tool when they actually need QR codes, so it is worth
            drawing the line. A QR code holds far more data, a full URL or a paragraph of text, and any
            smartphone reads it from any angle. A linear barcode holds a short ID string and is built
            for laser scanners at checkouts and in warehouses.
          </p>
          <p>
            Choose QR codes when a human with a phone is the scanner: menus, manuals, reviews, tickets,
            WiFi sharing. Choose barcodes when a system is the scanner: SKUs on shelves, VIN plates on
            vehicles, asset tags. If you need the latter, the related tools below include barcode style
            generators for SKUs and VINs.
          </p>
          <p>
            Some products need both: a barcode for the retailer's system and a QR code for the customer.
            Generate them in the same batch workflow so the two identifiers stay paired in your records,
            and keep one spreadsheet as the single source of truth for the pair.
          </p>
        </div>
      </section>
    </>
  );
}

const RELATED_TOOLS = [
  {
    slug: 'sku-generator',
    title: 'SKU Generator',
    desc: 'Create clean product SKUs in bulk for inventory and listings.',
  },
  {
    slug: 'vin-barcode-generator',
    title: 'VIN Barcode Generator',
    desc: 'Make Code 39 barcodes for vehicle identification numbers.',
  },
  {
    slug: 'business-name-generator',
    title: 'Business Name Generator',
    desc: 'Brainstorm memorable names for your next brand or product.',
  },
  {
    slug: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    desc: 'Generate SEO meta tags for any page in seconds.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Paste your list or upload a CSV',
    desc: 'Type or paste one URL or line of text per line. Working from a spreadsheet? Save it as CSV and upload it instead; the first column of each row becomes one QR code.',
  },
  {
    title: 'Choose size and colors',
    desc: 'Pick 128, 256, or 512 pixels and set your foreground and background colors. Dark codes on light backgrounds scan most reliably, and 512 px is the right choice for print.',
  },
  {
    title: 'Generate the batch',
    desc: 'Press Generate QR Codes. Up to 50 codes appear in a grid below, each rendered instantly in your browser. Nothing is uploaded anywhere.',
  },
  {
    title: 'Spot check with your phone',
    desc: 'Scan two or three codes before downloading. Catching a typo now is free; catching it after a print run is not.',
  },
  {
    title: 'Download PNGs, one by one or all at once',
    desc: 'Save individual codes with per-code download buttons, or press Download All PNG to save the full batch in a short sequence of downloads.',
  },
];

const isHexColor = (v: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());

export default function BulkQrCodeGenerator() {
  const [input, setInput] = useState('');
  const [fileLabel, setFileLabel] = useState('');
  const [size, setSize] = useState(256);
  const [dark, setDark] = useState('#0f172a');
  const [light, setLight] = useState('#ffffff');
  const [items, setItems] = useState<QrItem[]>([]);
  const [libStatus, setLibStatus] = useState<LibStatus>('loading');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const containersRef = useRef(new Map<number, HTMLDivElement>());
  const idRef = useRef(0);

  useEffect(() => {
    loadQrLib(setLibStatus);
  }, []);

  useEffect(() => {
    const id = 'rankvelt-bulk-qr-code-generator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Bulk QR Code Generator',
          url: 'https://www.rankvelt.com/tools/bulk-qr-code-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: BULK_QR_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileLabel(file.name);
    setError(null);
    try {
      const text = await file.text();
      const rows = parseCsvRows(text);
      if (rows.length === 0) {
        setError('No usable rows found in that file. Make sure it contains one URL or line of text per row.');
        return;
      }
      setInput(rows.join('\n'));
      if (rows.length > MAX_CODES) {
        setNotice(`That file has ${rows.length} rows. The first ${MAX_CODES} will be used per batch.`);
      }
    } catch {
      setError('Could not read that file. Make sure it is a valid CSV or text file.');
    }
  };

  const handleGenerate = () => {
    setError(null);
    setNotice(null);
    if (libStatus !== 'ready') {
      setError(
        'The QR code library is still loading. Wait a few seconds and try again, or press Retry if it failed to load.',
      );
      return;
    }
    const entries = parseLines(input);
    if (entries.length === 0) {
      setError('Paste at least one URL or line of text, or upload a CSV file, before generating.');
      return;
    }
    const cleanDark = isHexColor(dark) ? dark.trim() : '#0f172a';
    const cleanLight = isHexColor(light) ? light.trim() : '#ffffff';
    setDark(cleanDark);
    setLight(cleanLight);
    const seen = new Set<string>();
    const unique = entries.filter((e) => {
      if (seen.has(e)) return false;
      seen.add(e);
      return true;
    });
    const capped = unique.slice(0, MAX_CODES);
    if (unique.length > MAX_CODES) {
      setNotice(`You entered ${unique.length} unique entries. Only the first ${MAX_CODES} were generated to keep the page fast.`);
    } else if (entries.length !== unique.length) {
      setNotice(`${entries.length - unique.length} duplicate ${entries.length - unique.length === 1 ? 'entry was' : 'entries were'} removed.`);
    }
    containersRef.current.clear();
    setItems(
      capped.map((text) => {
        idRef.current += 1;
        return { id: idRef.current, text };
      }),
    );
  };

  const handleClear = () => {
    setInput('');
    setFileLabel('');
    setItems([]);
    setError(null);
    setNotice(null);
    containersRef.current.clear();
  };

  const downloadOne = (item: QrItem, index: number) => {
    const dataUrl = codeToDataUrl(containersRef.current.get(item.id) ?? null);
    if (!dataUrl) {
      setError('That code is not rendered yet. Wait a moment and try again.');
      return;
    }
    triggerDownload(dataUrl, `qr-code-${index + 1}.png`);
  };

  const downloadAll = async () => {
    if (items.length === 0 || downloading) return;
    setDownloading(true);
    setError(null);
    for (let i = 0; i < items.length; i++) {
      const dataUrl = codeToDataUrl(containersRef.current.get(items[i].id) ?? null);
      if (dataUrl) triggerDownload(dataUrl, `qr-code-${i + 1}.png`);
      await new Promise((r) => setTimeout(r, 400));
    }
    setDownloading(false);
  };

  const entryCount = parseLines(input).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
          <QrCode className="h-4 w-4" /> Free Business Tool
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Free Bulk QR Code Generator
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
          Creating dozens of QR codes one by one is slow and error prone. This free bulk QR code
          generator turns a pasted list or a CSV file into a full grid of scannable QR codes in
          seconds. Choose the size and colors, download each code as a PNG, or grab them all at once.
          Everything runs in your browser, so your list never leaves your computer and there is no
          signup.
        </p>

        {libStatus === 'error' && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div className="text-sm text-white/75">
              <p className="font-semibold text-white">The QR code library failed to load.</p>
              <p className="mt-1">
                It loads from cdnjs.cloudflare.com, so check your connection or ad blocker, then press
                Retry.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLibStatus('loading');
                  loadQrLib(setLibStatus);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black"
              >
                <RefreshCw className="h-4 w-4" /> Retry loading
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <label htmlFor="qr-input" className="mb-2 block text-sm font-semibold text-white">
              Your list: one URL or line of text per line
            </label>
            <textarea
              id="qr-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder={'https://example.com/manual-a\nhttps://example.com/manual-b\nTable 12: scan to see the menu'}
              className="w-full rounded-xl border border-white/[0.08] bg-black/40 p-4 font-mono text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label
                htmlFor="qr-file"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/5"
              >
                <Upload className="h-4 w-4 text-primary" /> Upload CSV
              </label>
              <input
                id="qr-file"
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {fileLabel && <span className="text-sm text-white/60">Loaded: {fileLabel}</span>}
              {entryCount > 0 && (
                <span className="text-sm text-white/60">
                  {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-white/60">
              For CSV files, the first column of each row becomes one QR code. Up to {MAX_CODES} codes
              per batch; duplicates are removed automatically.
            </p>
          </div>

          <div className="space-y-5 rounded-xl border border-white/[0.08] bg-black/40 p-5">
            <div>
              <label htmlFor="qr-size" className="mb-2 block text-sm font-semibold text-white">
                Code size
              </label>
              <select
                id="qr-size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-lg border border-white/[0.08] bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value={128}>128 px: quick on-screen check</option>
                <option value={256}>256 px: general digital use</option>
                <option value={512}>512 px: print ready</option>
              </select>
            </div>
            <div>
              <span className="mb-2 block text-sm font-semibold text-white">Colors</span>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isHexColor(dark) ? dark : '#0f172a'}
                    onChange={(e) => setDark(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-white/[0.08] bg-transparent"
                    aria-label="QR code foreground color"
                  />
                  <div className="flex-1">
                    <label htmlFor="qr-dark" className="text-xs text-white/60">Code color</label>
                    <input
                      id="qr-dark"
                      type="text"
                      value={dark}
                      onChange={(e) => setDark(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={isHexColor(light) ? light : '#ffffff'}
                    onChange={(e) => setLight(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded border border-white/[0.08] bg-transparent"
                    aria-label="QR code background color"
                  />
                  <div className="flex-1">
                    <label htmlFor="qr-light" className="text-xs text-white/60">Background color</label>
                    <input
                      id="qr-light"
                      type="text"
                      value={light}
                      onChange={(e) => setLight(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Keep the code dark and the background light for reliable scanning.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={libStatus !== 'ready'}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <QrCode className="h-5 w-5" />
                {libStatus === 'ready' ? 'Generate QR Codes' : 'Loading QR engine...'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/5"
              >
                <Trash2 className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm text-white/75">{error}</p>
          </div>
        )}
        {notice && (
          <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-4">
            <p className="text-sm text-white/75">{notice}</p>
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">
              Your QR codes {items.length > 0 && <span className="text-white/60">({items.length})</span>}
            </h2>
            {items.length > 0 && (
              <button
                type="button"
                onClick={downloadAll}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {downloading ? 'Downloading...' : 'Download All PNG'}
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-10 text-center">
              <QrCode className="mx-auto h-10 w-10 text-white/20" />
              <p className="mt-3 text-white/60">
                Your generated QR codes will appear here. Paste a list above and press Generate.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item, i) => (
                <div key={item.id} className="rounded-xl border border-white/[0.08] bg-black/40 p-4">
                  <QrCodeCell
                    text={item.text}
                    size={size}
                    dark={isHexColor(dark) ? dark.trim() : '#0f172a'}
                    light={isHexColor(light) ? light.trim() : '#ffffff'}
                    register={(el) => {
                      if (el) containersRef.current.set(item.id, el);
                      else containersRef.current.delete(item.id);
                    }}
                  />
                  <p className="mt-3 truncate text-sm text-white/60" title={item.text}>
                    {item.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => downloadOne(item, i)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5"
                  >
                    <Download className="h-4 w-4" /> Download PNG
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How It Works</h2>
        <ol className="mt-6 space-y-4">
          {HOW_IT_WORKS.map((s, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/20 p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <BulkQrCodeArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Bulk QR Code Generator: Frequently Asked Questions
        </h2>
        <div className="mt-6">
          <FaqAccordion faqs={BULK_QR_FAQS} />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Keep exploring</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Related Free Tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {RELATED_TOOLS.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-xl border border-white/[0.08] bg-black/20 p-5 hover:border-primary/40"
            >
              <h3 className="font-bold text-white group-hover:text-primary">{t.title}</h3>
              <p className="mt-1 text-sm text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-black tracking-tight text-white">
            Want More Traffic From the Codes You Print?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">
            QR codes send people somewhere; SEO decides what they find when they arrive. Get a free
            audit of the pages your codes point to and fix what is holding them back.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/strategy-call"
              className="rounded-lg bg-primary px-6 py-3 font-bold text-black"
            >
              Get a Free SEO Audit
            </a>
            <a
              href="/tools"
              className="rounded-lg border border-white/[0.08] px-6 py-3 font-semibold text-white/75 hover:bg-white/5"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
