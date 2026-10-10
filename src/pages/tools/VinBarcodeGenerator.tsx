// META: title="Free VIN Barcode Generator: Code 39 Barcodes Online" (max 60 chars, include target keyword)
// META: description="Generate VIN barcodes free: Code 39 barcodes for vehicle identification numbers, printable and downloadable. No signup." (max 160 chars, include target keyword)

import { useEffect, useRef, useState } from 'react';
import {
  Car,
  Tag,
  QrCode,
  Calculator,
  Lightbulb,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  Info,
  Barcode,
} from 'lucide-react';

const VIN_BARCODE_FAQS = [
  {
    q: 'What is a VIN barcode?',
    a: 'A VIN barcode is a machine readable version of a vehicle identification number, the 17 character code stamped on every car, truck, and motorcycle. It is most often printed as a Code 39 barcode on door jamb stickers, service labels, and shipping documents. Scanning the barcode fills the VIN into a system without manual typing, which removes transcription errors.',
  },
  {
    q: 'Why is Code 39 used for VIN barcodes?',
    a: 'Code 39 is the long standing automotive industry choice because it encodes capital letters and digits, prints clearly on basic label printers, and is readable by almost every barcode scanner ever made. VINs contain both letters and numbers, which Code 39 handles natively. It is also simple to verify visually, since the human readable VIN prints below the bars.',
  },
  {
    q: 'How do I know if a VIN is valid?',
    a: 'A valid VIN has exactly 17 characters, uses only letters and numbers, and never contains the letters I, O, or Q, because those look too much like 1 and 0. The 9th character is a check digit computed from the other 16 characters. This free VIN barcode generator runs all three checks automatically and explains exactly what is wrong when a VIN fails.',
  },
  {
    q: 'What is the VIN check digit?',
    a: 'The check digit is the 9th character of the VIN. It is calculated by converting every character to a number, multiplying each by a fixed weight, adding the results, and dividing by 11. The remainder becomes the check digit, with the letter X used when the remainder is 10. If even one character is mistyped, the check digit will not match, which is how systems catch errors.',
  },
  {
    q: 'Can I generate barcodes for many VINs at once?',
    a: 'Yes. Switch to bulk mode and paste one VIN per line, then generate the whole batch. Each VIN is validated individually, valid ones get a printable Code 39 barcode, and invalid ones are listed with the exact reason they failed so you can fix them. Every barcode can be downloaded as its own PNG file.',
  },
  {
    q: 'What size should I print VIN barcode labels?',
    a: 'For reliable scanning, print the barcode at least 5 cm (about 2 inches) wide with quiet zones, the blank margins on both ends, kept clear. Use a clean sans serif font for the human readable VIN below the bars, and test scan every new label design before a full print run. Higher print resolution, 300 dpi or better, gives the sharpest bars.',
  },
  {
    q: 'Do VIN barcodes need the internet to work?',
    a: 'No. A Code 39 VIN barcode simply encodes the 17 characters of the VIN, so any scanner reads it offline and outputs the text. The barcode does not look anything up. What happens after the scan, such as decoding the VIN in a dealer system, depends on that software, but the barcode itself works anywhere.',
  },
  {
    q: 'What is the difference between Code 39 and PDF417 for VINs?',
    a: 'Code 39 encodes the VIN as simple bars and is the standard for basic VIN labels. PDF417 is a two dimensional stacked barcode that can hold much more data, so it appears on documents like registration forms and inspection reports where extra vehicle details travel with the VIN. For a plain VIN label, Code 39 is the right choice; PDF417 is overkill unless you need to pack in more fields.',
  },
];

const JSBARCODE_CDN = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';

type JsBarcodeFn = (el: HTMLCanvasElement, value: string, options?: Record<string, unknown>) => void;

declare global {
  interface Window {
    JsBarcode?: JsBarcodeFn;
  }
}

const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

interface VinResult {
  vin: string;
  valid: boolean;
  errors: string[];
  expectedCheckDigit?: string;
}

function validateVin(raw: string): VinResult {
  const vin = raw.trim().toUpperCase();
  const errors: string[] = [];
  let expectedCheckDigit: string | undefined;

  if (vin.length === 0) {
    return { vin, valid: false, errors: ['Empty line.'] };
  }
  if (vin.length !== 17) {
    errors.push(`Must be exactly 17 characters (this has ${vin.length}).`);
  }
  if (/[IOQ]/.test(vin)) {
    errors.push('VINs never contain the letters I, O, or Q.');
  }
  if (/[^A-Z0-9]/.test(vin)) {
    errors.push('Only letters and numbers are allowed, no spaces or symbols.');
  }

  if (errors.length === 0) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const ch = vin[i];
      const value = /[0-9]/.test(ch) ? parseInt(ch, 10) : TRANSLITERATION[ch];
      if (typeof value !== 'number') {
        errors.push(`Character "${ch}" at position ${i + 1} cannot be decoded.`);
        break;
      }
      sum += value * VIN_WEIGHTS[i];
    }
    if (errors.length === 0) {
      const remainder = sum % 11;
      expectedCheckDigit = remainder === 10 ? 'X' : String(remainder);
      if (vin[8] !== expectedCheckDigit) {
        errors.push(
          `Check digit mismatch: position 9 is "${vin[8]}" but the other characters require "${expectedCheckDigit}". A digit was likely mistyped.`
        );
      }
    }
  }

  return { vin, valid: errors.length === 0, errors, expectedCheckDigit };
}

function VinBarcodeArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What Is a VIN Barcode</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Every car, truck, and motorcycle carries a vehicle identification number, a 17 character code that describes exactly one vehicle. The VIN tells you the manufacturer, the model year, the plant where it was built, and a serial number unique to that vehicle. You will find it stamped on the dashboard plate visible through the windshield, on the driver side door jamb sticker, on the title, and on insurance documents.
          </p>
          <p>
            A VIN barcode is simply that 17 character code printed as a machine readable barcode, most commonly in Code 39 format. Instead of reading the code by eye and typing it into a system, a technician scans the barcode and the VIN lands in the software instantly. In a dealership service lane or an auction lot, where dozens of VINs are processed per hour, scanning removes the typing errors that create wrong records.
          </p>
          <p>
            This free VIN barcode generator creates those Code 39 barcodes in your browser. Type one VIN or paste a list, and the tool validates each code, renders a crisp printable barcode, and lets you download each one as a PNG. There is no signup, no upload, and no watermark, which makes it practical for quick jobs like relabeling fleet vehicles or preparing inspection paperwork.
          </p>
          <p>
            It is worth knowing what a VIN barcode does not do. The barcode only carries the 17 characters. It does not encode the vehicle history, it does not verify the VIN against any registry, and scanning it does not fetch data by itself. The value is speed and accuracy at the point of entry: the exact characters, captured exactly right, every time.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Code 39</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Why Code 39 Is the Standard for VIN Barcodes</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Code 39 earned its place in the automotive industry decades ago and has never been replaced for basic VIN labels. It encodes capital letters, digits, and a few symbols, which covers everything a VIN can contain. It prints well on ordinary label printers, even at modest resolutions, and it can be read by virtually every barcode scanner in existence, from old laser guns to modern phone cameras.
          </p>
          <p>
            One reason Code 39 survives is visual honesty. The bars are wide enough that a human can roughly verify the pattern, and the human readable VIN printed below the bars gives a fallback when a scanner cannot read a damaged label. Newer barcode types pack more data into less space, but for a fixed 17 character string, that extra density buys nothing and adds compatibility risk.
          </p>
          <p>
            There are situations where Code 39 is not the answer. If you need to encode the VIN plus owner details, inspection results, or a long URL on one label, a stacked symbology like PDF417 holds far more data and is the better tool. Data Matrix codes suit tiny parts where space is measured in millimeters. Aztec codes appear in ticketing and transport documents. For a plain VIN barcode on a door jamb or a service tag, Code 39 remains the correct, compatible choice.
          </p>
          <p>
            When you generate a barcode with this tool, you get a true Code 39 symbol with proper start and stop characters and quiet zones. Those quiet zones, the blank margins on each side, are part of the barcode, not decoration. Scanners need them to find where the code begins and ends, so never crop the image tight to the bars when you place it on a label.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Validation</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How VIN Validation Works: The Check Digit Explained</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The cleverest part of the VIN system is the check digit, the 9th character. It is not random. It is calculated from the other 16 characters using a public formula, and its only job is to catch typing mistakes. Change any single character in a VIN, and the check digit will almost always stop matching, which tells the system the code was entered wrong.
          </p>
          <p>
            The math works like this. Each letter is first converted to a number using a fixed transliteration table, so A becomes 1, B becomes 2, and so on, while digits keep their own values. Each of the 17 positions has a fixed weight: the first position is multiplied by 8, the second by 7, down through a set of weights, with the 9th position itself weighted at zero. All the products are added together, the total is divided by 11, and the remainder becomes the check digit. A remainder of 10 is written as the letter X.
          </p>
          <p>
            This generator runs the full check every time you enter a VIN. It first confirms the length is exactly 17 characters, then rejects the forbidden letters I, O, and Q, which the VIN standard excludes because they look like 1 and 0. Then it computes the expected check digit and compares it to the 9th character. If anything fails, you get a plain English explanation of what is wrong, which usually points straight at the mistyped character.
          </p>
          <p>
            One honest caveat: a passing check digit proves the VIN is well formed, not that it belongs to a real vehicle. The formula catches transcription errors, but a completely invented 17 character code can still pass if its check digit was computed correctly. For confirming a VIN against reality, you need a registry or history service. For confirming it was typed correctly, the check digit is exactly the right tool.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Using the tool</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Use This Free VIN Barcode Generator</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start in single mode by typing or pasting one VIN into the input box. The tool validates it instantly and shows a green confirmation with the decoded check digit, or a red list of the exact problems found. When the VIN is valid, press Generate to render the Code 39 barcode on a clean white label card with the VIN printed beneath the bars.
          </p>
          <p>
            For larger jobs, switch to bulk mode and paste one VIN per line. Each line is validated independently, so a single bad VIN cannot spoil the batch. Valid entries each get their own barcode card, and invalid entries appear with their specific error messages so you can correct and rerun just those lines. This is the fastest way to prepare barcodes for a fleet inventory or an auction list.
          </p>
          <p>
            Every barcode card has its own PNG download button. The downloaded image has a white background with comfortable margins, so it drops straight into label design software or a Word document without editing. Download each card individually, or use the print button to send the whole batch of labels to your printer in one go.
          </p>
          <p>
            The barcode library loads from a CDN when the page opens. If your connection blocks it, the tool tells you plainly instead of showing a broken image, and the validation still works, because that logic runs locally. Refresh the page with a working connection to restore barcode rendering.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Printing</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Printing and Scanning VIN Barcodes That Actually Work</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A barcode that looks fine on screen can still fail at the scanner, and the causes are almost always physical. Print at 300 dpi or better so the bar edges stay sharp. Keep the barcode at least 5 cm wide, and never scale it down to fit a small space, because narrow bars fall below what cheap scanners can resolve. Black bars on a white background give the strongest contrast, which is what this tool generates by default.
          </p>
          <p>
            Protect the quiet zones. Those blank margins on each side of the bars are part of the code, and text, borders, or label edges that crowd them will cause misreads. When you place the PNG on a label, leave clear space around the whole symbol. Laminating over a barcode is fine, but glossy laminate can create reflections that blind laser scanners, so matte laminate or plain paper is the safer choice for labels scanned in bright workshops.
          </p>
          <p>
            Always test scan before a full print run. Print one label, scan it with the actual scanner that will be used in the field, and confirm the decoded text matches the VIN character for character. Phone camera scanners are convenient for testing, but they are more forgiving than old laser guns, so test with the weakest scanner in your workflow, not the strongest.
          </p>
          <p>
            Store the source images, not just the printed labels. When a label fades, peels, or gets covered in grease, you want to reprint the identical barcode in seconds. The PNG downloads from this tool are sized for that purpose, and naming each file with its VIN keeps your archive searchable.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Common VIN Mistakes and How to Fix Them</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most frequent VIN error is a wrong character count. People copy VINs from documents where the code wraps across lines, or they include a stray space, and end up with 16 or 18 characters. The fix is simple: copy the VIN into the validator and let it count. The tool reports the exact length it found, which usually reveals the extra or missing character immediately.
          </p>
          <p>
            Next come the forbidden letters. Because VINs never contain I, O, or Q, a code that includes them was either misread from a plate or mixed up with a different numbering system. On a worn door jamb sticker, a 1 can look like an I and a 0 can look like an O, so check the physical plate again when the validator flags these letters.
          </p>
          <p>
            Check digit mismatches are the subtlest errors. They mean every character looks legal and the length is right, but one character is wrong. The usual suspects are transposed neighbors, like 47 typed as 74, or visually similar pairs like 5 and S. Re enter the VIN slowly from the source document, character by character, and the mismatch almost always disappears.
          </p>
          <p>
            Finally, watch out for VINs that validate but belong to a different vehicle than you expect. This happens when a document was copied from the wrong record, which no check digit formula can detect. When a VIN matters, for a purchase, an insurance policy, or a registration, always confirm it against the physical plate on the vehicle itself, not just against paperwork.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Beyond Code 39</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Other Barcode Types: PDF417, Data Matrix, and Aztec</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Code 39 is the right default for VIN labels, but the barcode world is bigger, and knowing the alternatives helps you pick correctly when a job is unusual. PDF417 is a stacked two dimensional barcode that can hold over a kilobyte of data. It shows up on vehicle registration documents and inspection forms because it can carry the VIN plus owner, odometer, and inspection details in one symbol.
          </p>
          <p>
            Data Matrix codes are tiny square symbols designed for marking small parts. An engine block or a transmission case does not have room for a wide Code 39 label, so a Data Matrix etched directly into the metal carries the part identity in a few millimeters. Aztec codes, another compact 2D format, are common in transport ticketing and some toll systems where the symbol must survive poor print quality.
          </p>
          <p>
            The older ITF 14 format belongs to shipping cartons, not vehicles, encoding the 14 digit codes on case packaging. It cannot represent letters at all, so it has no role in VIN labeling. Mentioning it here only to save you a wrong turn: if a search led you from ITF 14 to VIN barcodes, you want Code 39.
          </p>
          <p>
            The practical rule is simple. If the job is a plain VIN label for scanning into a system, use Code 39 from this generator. If you need to pack a whole form worth of data into one symbol, look for a dedicated PDF417 barcode generator instead. Matching the symbology to the job is what separates labels that scan first time from labels that cause queues at the service desk.
          </p>
        </div>
      </section>
    </>
  );
}

export default function VinBarcodeGenerator() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleVin, setSingleVin] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [results, setResults] = useState<VinResult[]>([]);
  const [libLoaded, setLibLoaded] = useState(false);
  const [libError, setLibError] = useState(false);
  const [renderError, setRenderError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const canvasRefs = useRef<Map<string, HTMLCanvasElement | null>>(new Map());

  useEffect(() => {
    if (window.JsBarcode) {
      setLibLoaded(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${JSBARCODE_CDN}"]`);
    if (existing) {
      if (window.JsBarcode) setLibLoaded(true);
      else {
        existing.addEventListener('load', () => setLibLoaded(true));
        existing.addEventListener('error', () => setLibError(true));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = JSBARCODE_CDN;
    script.async = true;
    script.onload = () => setLibLoaded(true);
    script.onerror = () => setLibError(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!libLoaded || !window.JsBarcode) return;
    setRenderError('');
    results.forEach((r, idx) => {
      if (!r.valid) return;
      const canvas = canvasRefs.current.get(`vin-${idx}`);
      if (!canvas || !window.JsBarcode) return;
      try {
        window.JsBarcode(canvas, r.vin, {
          format: 'CODE39',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 15,
          margin: 14,
          background: '#ffffff',
          lineColor: '#000000',
        });
      } catch {
        setRenderError('One or more barcodes could not be rendered. Check that each VIN is valid and try again.');
      }
    });
  }, [results, libLoaded]);

  useEffect(() => {
    const id = 'rankvelt-vin-barcode-generator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free VIN Barcode Generator',
          url: 'https://www.rankvelt.com/tools/vin-barcode-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: VIN_BARCODE_FAQS.map((f) => ({
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

  const handleGenerateSingle = () => {
    if (!singleVin.trim()) {
      setResults([{ vin: '', valid: false, errors: ['Enter a VIN first, then press Generate.'] }]);
      return;
    }
    setResults([validateVin(singleVin)]);
  };

  const handleBulkGenerate = () => {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setResults([{ vin: '', valid: false, errors: ['Paste at least one VIN, one per line.'] }]);
      return;
    }
    setResults(lines.map((l) => validateVin(l)));
  };

  const handleClear = () => {
    setResults([]);
    setSingleVin('');
    setBulkText('');
    setRenderError('');
    canvasRefs.current.clear();
  };

  const handleDownloadPng = (idx: number, vin: string) => {
    const canvas = canvasRefs.current.get(`vin-${idx}`);
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `vin-barcode-${vin}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid && r.vin).length;

  const inputCls =
    'w-full rounded-lg border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60';

  const related = [
    { slug: 'sku-generator', title: 'SKU Generator', desc: 'Create unique product SKUs with custom patterns in bulk.', Icon: Tag },
    { slug: 'bulk-qr-code-generator', title: 'Bulk QR Code Generator', desc: 'Generate many QR codes at once from a pasted list.', Icon: QrCode },
    { slug: 'markup-calculator', title: 'Markup Calculator', desc: 'Price products from cost with instant markup math.', Icon: Calculator },
    { slug: 'business-name-generator', title: 'Business Name Generator', desc: 'Find a strong name for your next venture.', Icon: Lightbulb },
  ];

  return (
    <main className="px-4 pb-24 pt-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Free Business Tool</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Free VIN Barcode Generator: Code 39 Barcodes Online
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            Generate VIN barcodes free with full 17 character validation. This VIN barcode generator checks the length, rejects forbidden letters, verifies the check digit, and renders a crisp Code 39 barcode you can print or download as PNG. No signup, everything runs in your browser.
          </p>

          <div className="mt-8">
            <div className="flex max-w-md gap-2 rounded-xl border border-white/[0.08] bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'single' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
              >
                Single VIN
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'bulk' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
              >
                Bulk list
              </button>
            </div>

            {mode === 'single' ? (
              <div className="mt-6 max-w-2xl">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                  Vehicle identification number (17 characters)
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={singleVin}
                    onChange={(e) => setSingleVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/gi, ''))}
                    placeholder="e.g. 1HGCM82633A004352"
                    maxLength={17}
                    className={`${inputCls} font-mono uppercase tracking-widest`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateSingle();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSingle}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
                  >
                    <Barcode size={16} /> Generate
                  </button>
                </div>
                <p className="mt-2 text-xs text-white/40">{singleVin.length}/17 characters</p>
              </div>
            ) : (
              <div className="mt-6 max-w-2xl">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                  VINs, one per line
                </label>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={'1HGCM82633A004352\n2FACP8CF0LX123456'}
                  rows={6}
                  className={`${inputCls} resize-y font-mono uppercase`}
                />
                <button
                  type="button"
                  onClick={handleBulkGenerate}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
                >
                  <Barcode size={16} /> Generate barcodes
                </button>
              </div>
            )}

            {libError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>
                  The barcode library could not be loaded. Check your internet connection and refresh the page to restore barcode rendering. VIN validation still works without it.
                </p>
              </div>
            )}
            {renderError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>{renderError}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
                    <Car size={16} className="text-primary" /> Results
                    {validCount > 0 && (
                      <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-300">{validCount} valid</span>
                    )}
                    {invalidCount > 0 && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-300">{invalidCount} invalid</span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    {validCount > 0 && (
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-primary/50 hover:text-white"
                      >
                        <Printer size={14} /> Print labels
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-bold text-white/60 transition hover:border-red-500/50 hover:text-red-300"
                    >
                      <Trash2 size={14} /> Clear
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {results.map((r, idx) =>
                    r.valid ? (
                      <div key={idx} className="rounded-xl border border-white/[0.08] bg-white p-5 text-center">
                        <canvas
                          ref={(el) => {
                            canvasRefs.current.set(`vin-${idx}`, el);
                          }}
                          className="mx-auto max-w-full"
                        />
                        <p className="mt-3 font-mono text-xs font-bold tracking-widest text-black">{r.vin}</p>
                        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-green-700">
                          <CheckCircle2 size={13} /> Valid VIN, check digit {r.expectedCheckDigit} confirmed
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDownloadPng(idx, r.vin)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-black text-white transition hover:opacity-80"
                        >
                          <Download size={13} /> Download PNG
                        </button>
                      </div>
                    ) : (
                      <div key={idx} className="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-5">
                        <p className="flex items-center gap-2 font-mono text-sm font-bold text-red-300">
                          <XCircle size={16} className="shrink-0" /> {r.vin || '(empty)'}
                        </p>
                        <ul className="mt-2 space-y-1">
                          {r.errors.map((e, i) => (
                            <li key={i} className="text-sm leading-relaxed text-red-200/80">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {results.length === 0 && (
              <div className="mt-8 flex items-start gap-2 rounded-xl border border-white/[0.08] bg-black/30 p-4 text-xs leading-relaxed text-white/50">
                <Info size={15} className="mt-0.5 shrink-0 text-primary" />
                <p>
                  Every VIN is validated before a barcode is drawn: exactly 17 characters, no I, O, or Q, and a check digit that matches the other 16 characters. Invalid entries are explained, never silently skipped.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Generate a VIN Barcode in Four Steps</h2>
        <div className="mt-6 space-y-4">
          {[
            { n: '1', t: 'Enter the VIN', d: 'Type one VIN for single mode, or paste a list with one VIN per line for bulk mode. The input accepts only letters and numbers and counts characters as you type.' },
            { n: '2', t: 'Automatic validation', d: 'The tool checks the 17 character length, rejects the forbidden letters I, O, and Q, and verifies the 9th character check digit with the official weighting formula. Problems are explained in plain English.' },
            { n: '3', t: 'Render the Code 39 barcode', d: 'Valid VINs are drawn as true Code 39 symbols with proper start and stop characters, quiet zones, and the human readable VIN below the bars, on a clean white label card.' },
            { n: '4', t: 'Download or print', d: 'Download each barcode as an individual PNG for your label software, or print the whole batch of labels at once. Test scan one label before a full print run.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/20 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">{s.n}</span>
              <div>
                <h3 className="font-bold text-white">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VinBarcodeArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">VIN Barcode Generator FAQs</h2>
        <div className="mt-6 space-y-3">
          {VIN_BARCODE_FAQS.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-bold text-white">{f.q}</span>
                <span className={`shrink-0 text-xl font-black text-primary transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="text-2xl font-black tracking-tight text-white">Related free tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-xl border border-white/[0.08] bg-black/20 p-5 transition hover:border-primary/40"
            >
              <t.Icon size={22} className="text-primary" />
              <h3 className="mt-3 font-bold text-white group-hover:text-primary">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Run an Auto Business That Gets Found Online</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Barcodes keep your operation accurate, but customers still need to find you first. Get a free SEO audit and see how to rank higher for the searches that bring buyers through your door.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/strategy-call" className="rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:opacity-90">
              Get a Free SEO Audit
            </a>
            <a href="/tools" className="rounded-lg border border-white/[0.12] px-6 py-3 text-sm font-bold text-white transition hover:border-primary/50">
              Browse All Tools
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
