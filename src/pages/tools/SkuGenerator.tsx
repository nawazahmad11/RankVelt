// META: title="Free SKU Generator for Products & Inventory" (max 60 chars, include target keyword)
// META: description="Generate product SKUs free: custom patterns from product names, categories and variants, bulk list output. No signup." (max 160 chars, include target keyword)

import { useEffect, useRef, useState } from 'react';
import {
  Package,
  Barcode,
  QrCode,
  Calculator,
  Percent,
  Copy,
  Download,
  Check,
  AlertTriangle,
  Trash2,
  Sparkles,
  FileSpreadsheet,
  Info,
} from 'lucide-react';

const SKU_GENERATOR_FAQS = [
  {
    q: 'What is a SKU number?',
    a: 'A SKU (stock keeping unit) is a unique code a business assigns to each distinct product and variant it sells. It usually combines short codes for the brand, category, product, and variant so staff can identify an item at a glance. SKUs are used for inventory counts, order picking, warehouse bins, and reporting. They are internal codes, separate from manufacturer barcodes like UPCs.',
  },
  {
    q: 'How do I generate SKU numbers for my products?',
    a: 'Pick a consistent pattern before you create any codes. A common pattern is BRAND-CATEGORY-PRODUCT-VARIANT plus a short random segment, for example NK-SHO-RUNA-BLK-7K2P. Enter your product details in this free SKU generator, set your prefix, separator, and target length, and it builds codes that follow your pattern. In bulk mode you can paste a whole product list and get one unique SKU per line.',
  },
  {
    q: 'Can I use a random SKU generator instead of a pattern?',
    a: 'Random SKUs guarantee uniqueness easily, but they are hard for humans to read and remember. A pattern based code lets warehouse staff guess roughly what an item is from the code alone, which speeds up picking and reduces errors. The best approach is a hybrid: meaningful codes for brand, category, and variant, plus a short random segment at the end to guarantee uniqueness.',
  },
  {
    q: 'What are Amazon SKU rules?',
    a: 'Amazon seller SKUs (also called merchant SKUs or MSKUs) must be unique within your seller account and can be up to 40 characters. Amazon recommends alphanumeric codes without spaces, and the SKU you assign when you list a product should never be reused for a different product. Many sellers use this kind of Amazon SKU generator to create clean codes, then map each SKU to the product ASIN in their inventory file.',
  },
  {
    q: 'What are Shopify SKU requirements?',
    a: 'Shopify SKUs must be unique per product variant, not just per product, so each size or color needs its own code. There is no fixed length rule, but short alphanumeric codes scan better and fit on labels. Shopify uses the SKU for inventory tracking and for matching products during CSV imports, so keeping one consistent pattern across your catalog makes bulk updates much safer.',
  },
  {
    q: 'Should my SKU match the barcode or UPC number?',
    a: 'No. A UPC or EAN is a globally unique manufacturer barcode, while a SKU is your own internal code. One product can carry the same UPC across many sellers, but each seller uses their own SKU. If you sell products you manufacture yourself and need barcodes, pair this SKU generator with a barcode tool and print the SKU as a Code 39 or Code 128 label for internal scanning.',
  },
  {
    q: 'How long should a SKU be?',
    a: 'Most businesses do well with 8 to 12 characters. Shorter codes are easier to type and scan, while longer codes can carry more meaning. If a SKU gets too long it will not fit on small price labels and staff will mistype it. Pick a target length in the pattern builder above and keep every SKU in your catalog at the same length.',
  },
  {
    q: 'Can I change a SKU after creating it?',
    a: 'You can, but it is risky. Changing a SKU breaks the link to past sales history, reorder points, and any printed labels or listings that reference the old code. Most inventory systems treat a renamed SKU as a brand new product. Only change a SKU when you have a real reason, such as a full catalog restructure, and update every system and label at the same time.',
  },
];

const cleanCode = (s: string, max?: number): string => {
  const c = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return typeof max === 'number' ? c.slice(0, max) : c;
};

const nameInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .map((w) => w.replace(/[^A-Za-z0-9]/g, '').charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4);
};

const randomString = (len: number): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  if (len <= 0) return out;
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
};

interface GeneratedSku {
  id: number;
  product: string;
  sku: string;
  duplicate: boolean;
}

function SkuGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What Is a SKU and Why Does It Matter</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A SKU, short for stock keeping unit, is a unique code a business assigns to every distinct product and variant it sells. If you sell a t-shirt in three sizes and two colors, that is six SKUs, one for each combination. The code exists so your systems and your staff can tell those six items apart instantly, without opening a box or reading a long product title.
          </p>
          <p>
            Good SKU numbers do quiet, boring, valuable work. They speed up receiving, because incoming stock can be scanned or typed against a purchase order. They speed up picking, because a picker can match a code on a shelf bin to a code on an order. They make inventory counts possible, because you can count codes instead of guessing which nearly identical product is which. And they make reporting honest, because sales, returns, and margins are tracked per SKU.
          </p>
          <p>
            The businesses that struggle with inventory almost always share one trait: messy or missing SKU systems. Codes get invented on the fly, two products share one code, one product carries three codes, and nobody trusts the stock numbers. A free SKU generator tool does not fix discipline on its own, but it removes the friction that causes the mess, by making it fast to create clean, consistent, unique codes every time.
          </p>
          <p>
            It helps to understand what a SKU is not. A SKU is not a barcode number like a UPC or EAN. Those are issued by standards organizations and are meant to be globally unique across every seller. A SKU is your own internal code, and it only needs to be unique inside your business. It is also not a product title. Titles are for customers. SKUs are for operations.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Patterns</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Generate SKU Code Patterns That Scale</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Learning how to generate SKU numbers the right way starts with designing a pattern before you create a single code. A pattern is a recipe: fixed positions that always mean the same thing. A popular recipe is brand code, then category code, then a product identifier, then a variant code, then a short random segment. For example, NK-SHO-RUNA-BLK-7K2P could mean brand NK, category shoes, product RUNA, variant black, plus a random segment for uniqueness.
          </p>
          <p>
            Each part of the pattern should earn its place. Brand codes matter if you are a retailer or distributor carrying many brands. Category codes help with warehouse zoning and with filtering reports by department. Variant codes are essential for apparel, footwear, and anything sold in sizes or colors, because the variant is usually what actually differs in the bin. The random segment at the end is the insurance policy: it guarantees that two products with similar names can never collide.
          </p>
          <p>
            Keep every code the same length. When all SKUs are, say, 12 characters, staff learn the rhythm of the code, labels look uniform, and spreadsheet columns line up. Set a target length in the pattern builder above and the generator pads shorter codes with a random segment or trims longer ones to fit. Decide the length once, document it, and never change it casually, because changing the length later means rebuilding every label and every import template.
          </p>
          <p>
            Choose a separator and stick with it. Dashes are the most readable choice for humans, underscores survive in systems that strip dashes, and no separator at all gives the shortest codes. Avoid spaces and special characters entirely. Spaces get trimmed by spreadsheets, slashes get read as folder paths by some software, and accented characters break older systems. Letters and numbers only, plus one separator, is the safest rule in the industry.
          </p>
          <p>
            Plan for growth when you pick code widths. A two character category code gives you room for a limited set of clean codes, while three or four characters leave room to add departments later without redesigning the pattern. The same applies to product identifiers. Using initials from the product name works for a small catalog, but a large catalog with many similar names will eventually need the random segment to do the heavy lifting, which is exactly why this generator includes one.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Using the tool</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">How to Use This Free SKU Generator</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            This free SKU generator has two modes. In single mode, you type one product name and fill in optional codes for brand, category, and variant, then press Generate. The tool assembles your pattern, adds the random uniqueness segment, checks it against everything generated in this session, and adds the result to your list. It is the fastest way to create a handful of codes that all follow the same rules.
          </p>
          <p>
            In bulk mode, you paste a list of product names, one per line, and the generator creates one SKU per line. The brand and category codes you set apply to the whole batch, which is perfect for launching a new collection or importing a supplier list. Every code in the batch is checked for uniqueness before it is accepted, so you never get two identical SKUs from one paste.
          </p>
          <p>
            When your list is ready, use the copy all button to grab every SKU as plain text, or download a CSV file with two columns, product name and SKU. That CSV opens directly in Excel or Google Sheets, which makes this a practical free SKU generator for Excel workflows without any plugin. From there you can upload the file to Shopify, WooCommerce, or your warehouse system.
          </p>
          <p>
            One habit will save you hours: generate SKUs before you create the products in your store, not after. When the codes exist first, product creation becomes a simple copy and paste job, and you avoid the common mess of placeholder codes like TEST1 or NEW-PRODUCT that never get replaced. Treat the SKU as the product identity from the very first step.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Marketplaces</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Amazon and Shopify SKU Rules, Explained</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            If you sell on Amazon, you will meet the Amazon SKU generator question early: what code should go in the merchant SKU field. Amazon calls it the seller SKU or MSKU. It must be unique within your seller account, it can be up to 40 characters long, and Amazon recommends plain alphanumeric codes with no spaces. The SKU you assign is how Amazon links your listing to your inventory quantity, your FBA shipments, and your reports.
          </p>
          <p>
            The Amazon rule that catches sellers out is permanence. Once a SKU is assigned to a listing, changing it is difficult and risky, and reusing a SKU for a different product corrupts your history. That is why it pays to generate deliberate, patterned codes from the start rather than letting Amazon auto assign something meaningless. A code like NK-SHO-RUNA-BLK-7K2P tells you what the product is years later, when you are reviewing old reports.
          </p>
          <p>
            Shopify has its own twist. On Shopify, the SKU lives at the variant level, which means each size and color combination needs its own unique code. This is where a Shopify SKU generator with variant support earns its keep: enter the variant once, and the tool builds a distinct code for every combination. Shopify also uses SKUs to match rows during CSV imports, so consistent codes make bulk price or stock updates safe instead of scary.
          </p>
          <p>
            If you sell on both Amazon and Shopify, use the same SKU in both places. One code per physical item across every channel is the foundation of multichannel inventory. When a unit sells on Amazon, your system should decrement the same SKU that Shopify shows. Sellers who keep separate code systems per channel end up overselling, because no single number reflects true stock.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Uniqueness</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Unique SKU Generator Logic: Why Duplicates Are Dangerous</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The single most important property of a SKU is uniqueness. Two products sharing one SKU is one of the most expensive mistakes in retail operations. Orders get picked wrong, inventory counts lie, and returns get credited to the wrong item. A unique SKU generator prevents this by checking every new code against the full batch before accepting it.
          </p>
          <p>
            Purely random SKU generators make uniqueness easy, since a long enough random string will essentially never repeat. The downside is readability: a code like X7Q2M9PL tells a picker nothing. Patterned codes flip the tradeoff: they are readable, but similar products can produce similar codes, so collisions become possible. The hybrid approach used here, meaningful prefix parts plus a short random tail, gets you both readability and a uniqueness guarantee.
          </p>
          <p>
            If this tool ever cannot produce a unique code after many attempts, it flags the row as a duplicate instead of silently accepting a collision. In practice this almost never happens with a random segment of three or more characters, but the flag exists because a quiet duplicate is worse than a loud warning. When you see it, lengthen the random segment or add a distinguishing variant code.
          </p>
          <p>
            Uniqueness also means never reusing a retired SKU. When a product is discontinued, its code should be retired with it, like a jersey number. Reassigning an old code to a new product merges two products histories in your reports and confuses anyone who kept an old label. Keep a retired list, and let the generator keep making fresh codes.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Common SKU Mistakes to Avoid</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most common mistake is embedding information that changes. Putting the price, the supplier, or the season into the SKU feels clever until the price changes or you switch suppliers, and suddenly the code lies about the product. SKUs should describe what the item is, not its current commercial details. Keep pricing in your price fields and suppliers in your supplier fields.
          </p>
          <p>
            The second mistake is letting codes grow organically. One person uses dashes, another uses underscores, someone adds the color in plain English, and within a year the catalog has five competing formats. The fix is a written SKU policy, one page that shows the pattern, the code lists for brands and categories, and the target length. Generate every new code with the same tool and the same settings, and the format stays consistent by default.
          </p>
          <p>
            A third mistake is making SKUs too clever. Codes that encode six attributes become puzzles that only their creator can read, and they break the moment an attribute does not fit the scheme. If your team cannot explain a SKU in one sentence, simplify the pattern. Readable beats comprehensive.
          </p>
          <p>
            Finally, avoid confusing characters. The letter O and the number 0, the letter I and the number 1, look identical in many fonts and on thermal labels. This generator uses a character set that excludes the most confusing characters from the random segment, which is a small detail that prevents real picking errors. Apply the same care to your manual codes.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Best practices</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">SKU Best Practices Checklist for Growing Stores</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The best free SKU generator is only as good as the system around it, so here is the checklist experienced operations teams follow. First, write down your pattern and keep it to one page. Second, maintain controlled lists for brand and category codes so nobody invents a new abbreviation on the spot. Third, fix your target length and separator, and generate every code through the same process.
          </p>
          <p>
            Fourth, generate SKUs before products go live in your store or marketplace listings, and store them in one master spreadsheet or inventory system that everyone trusts. Fifth, use the same SKU across every sales channel, so Amazon, Shopify, and your warehouse all decrement the same code. Sixth, retire codes permanently when products are discontinued, and never reassign them.
          </p>
          <p>
            Seventh, review your catalog twice a year for duplicates, near duplicates, and codes that break the pattern. A quick export and a sort in Excel reveals most problems in minutes. Fix issues in a planned cleanup, not during a busy season, and update labels and listings at the same time so no old code survives in the wild.
          </p>
          <p>
            Follow this checklist and your SKUs become an asset instead of a liability. New staff learn the system in an afternoon, inventory counts finish on time, and your reports tell the truth about which products actually make money. That is the real return on spending an hour to set up clean SKU numbers, and it is why the top performing stores treat SKU design as infrastructure, not paperwork.
          </p>
        </div>
      </section>
    </>
  );
}

export default function SkuGenerator() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [productName, setProductName] = useState('');
  const [brandCode, setBrandCode] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [variant, setVariant] = useState('');
  const [prefix, setPrefix] = useState('');
  const [separator, setSeparator] = useState('-');
  const [targetLength, setTargetLength] = useState(12);
  const [bulkText, setBulkText] = useState('');
  const [session, setSession] = useState<GeneratedSku[]>([]);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const usedRef = useRef<Set<string>>(new Set());
  const idRef = useRef(1);

  const buildCore = (product: string): string => {
    const parts: string[] = [];
    if (prefix.trim()) parts.push(cleanCode(prefix, 6));
    if (brandCode.trim()) parts.push(cleanCode(brandCode, 4));
    if (categoryCode.trim()) parts.push(cleanCode(categoryCode, 4));
    const initials = nameInitials(product);
    if (initials) parts.push(initials);
    if (variant.trim()) parts.push(cleanCode(variant, 4));
    return parts.join(separator);
  };

  const finishSku = (core: string): string => {
    const remaining = targetLength - core.length;
    if (remaining > 0) {
      const rand = randomString(remaining);
      return core ? core + separator + rand : rand;
    }
    if (remaining < 0) return core.slice(0, targetLength);
    return core;
  };

  const makeUnique = (core: string): { sku: string; duplicate: boolean } => {
    for (let i = 0; i < 60; i++) {
      const sku = finishSku(core);
      if (!usedRef.current.has(sku)) {
        usedRef.current.add(sku);
        return { sku, duplicate: false };
      }
    }
    const fallback = finishSku(core);
    return { sku: fallback, duplicate: true };
  };

  const handleGenerateSingle = () => {
    setError('');
    if (!productName.trim()) {
      setError('Enter a product name first, then press Generate.');
      return;
    }
    const { sku, duplicate } = makeUnique(buildCore(productName));
    const entry: GeneratedSku = {
      id: idRef.current++,
      product: productName.trim(),
      sku,
      duplicate,
    };
    setSession((prev) => [entry, ...prev]);
    if (duplicate) {
      setError('This SKU collided with an existing one and could not be made unique. Try a longer target length or add a variant code.');
    }
  };

  const handleBulkGenerate = () => {
    setError('');
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setError('Paste at least one product name, one per line.');
      return;
    }
    const entries: GeneratedSku[] = lines.map((line) => {
      const { sku, duplicate } = makeUnique(buildCore(line));
      return { id: idRef.current++, product: line, sku, duplicate };
    });
    setSession((prev) => [...entries.reverse(), ...prev]);
    const dupes = entries.filter((e) => e.duplicate).length;
    if (dupes > 0) {
      setError(`${dupes} line(s) produced duplicate SKUs. Increase the target length and regenerate those lines.`);
    }
  };

  const copyText = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
      return ok;
    }
  };

  const handleCopyOne = async (entry: GeneratedSku) => {
    const ok = await copyText(entry.sku);
    if (ok) {
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId((c) => (c === entry.id ? null : c)), 1500);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyText(session.map((e) => e.sku).join('\n'));
    if (ok) {
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 1500);
    }
  };

  const handleDownloadCsv = () => {
    const rows = session.map((e) => `"${e.product.replace(/"/g, '""')}","${e.sku}"`);
    const csv = 'Product,SKU\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skus.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setSession([]);
    usedRef.current.clear();
    setError('');
  };

  useEffect(() => {
    const id = 'rankvelt-sku-generator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free SKU Generator',
          url: 'https://www.rankvelt.com/tools/sku-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: SKU_GENERATOR_FAQS.map((f) => ({
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

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const related = [
    { slug: 'vin-barcode-generator', title: 'VIN Barcode Generator', desc: 'Create Code 39 barcodes for vehicle identification numbers.', Icon: Barcode },
    { slug: 'bulk-qr-code-generator', title: 'Bulk QR Code Generator', desc: 'Generate many QR codes at once from a pasted list.', Icon: QrCode },
    { slug: 'markup-calculator', title: 'Markup Calculator', desc: 'Price products from cost with instant markup math.', Icon: Calculator },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', desc: 'Check margins before you set your final price.', Icon: Percent },
  ];

  const inputCls =
    'w-full rounded-lg border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60';

  return (
    <main className="px-4 pb-24 pt-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">Free eCommerce Tool</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Free SKU Generator for Products and Inventory
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            Generate product SKUs free with a pattern you control. Build clean SKU numbers from product names, brand and category codes, and variants, then generate in bulk with one SKU per line. Every code is checked for uniqueness, and you can copy all results or download them as CSV for Excel, Shopify, or Amazon.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="flex gap-2 rounded-xl border border-white/[0.08] bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'single' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Single product
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bulk')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'bulk' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Bulk list
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Prefix (optional)</label>
                  <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. NK" className={inputCls} maxLength={6} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Separator</label>
                  <select value={separator} onChange={(e) => setSeparator(e.target.value)} className={inputCls}>
                    <option value="-">Dash (-)</option>
                    <option value="_">Underscore (_)</option>
                    <option value="">None</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Brand code</label>
                  <input value={brandCode} onChange={(e) => setBrandCode(e.target.value)} placeholder="e.g. NK" className={inputCls} maxLength={4} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Category code</label>
                  <input value={categoryCode} onChange={(e) => setCategoryCode(e.target.value)} placeholder="e.g. SHO" className={inputCls} maxLength={4} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Variant (optional)</label>
                  <input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="e.g. BLK for black" className={inputCls} maxLength={8} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Target length</label>
                  <input
                    type="number"
                    min={6}
                    max={24}
                    value={targetLength}
                    onChange={(e) => setTargetLength(Math.min(24, Math.max(6, Number(e.target.value) || 12)))}
                    className={inputCls}
                  />
                </div>
              </div>

              {mode === 'single' ? (
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">Product name</label>
                  <input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Nike Air Running Shoes"
                    className={inputCls}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateSingle();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSingle}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
                  >
                    <Sparkles size={16} /> Generate SKU
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
                    Product names, one per line
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={'Nike Air Running Shoes\nAdidas Court Sneakers\nPuma Training Tee'}
                    rows={6}
                    className={`${inputCls} resize-y font-mono`}
                  />
                  <button
                    type="button"
                    onClick={handleBulkGenerate}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
                  >
                    <Sparkles size={16} /> Generate {bulkText.split('\n').filter((l) => l.trim()).length || ''} SKUs
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
                    <Package size={16} className="text-primary" /> Generated SKUs
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">{session.length}</span>
                  </h2>
                </div>
                {session.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-dashed border-white/[0.12] p-8 text-center">
                    <Package size={28} className="mx-auto text-white/25" />
                    <p className="mt-3 text-sm text-white/50">No SKUs yet. Fill in a product and press Generate.</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCopyAll}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-primary/50 hover:text-white"
                      >
                        {copiedAll ? <Check size={14} className="text-primary" /> : <Copy size={14} />} {copiedAll ? 'Copied' : 'Copy all'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadCsv}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-bold text-white/80 transition hover:border-primary/50 hover:text-white"
                      >
                        <FileSpreadsheet size={14} /> <Download size={14} /> CSV
                      </button>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-bold text-white/60 transition hover:border-red-500/50 hover:text-red-300"
                      >
                        <Trash2 size={14} /> Clear
                      </button>
                    </div>
                    <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
                      {session.map((e) => (
                        <li key={e.id} className="rounded-lg border border-white/[0.08] bg-black/30 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-sm font-bold text-primary">{e.sku}</p>
                            <button
                              type="button"
                              onClick={() => handleCopyOne(e)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-white/60 transition hover:text-white"
                              title="Copy SKU"
                            >
                              {copiedId === e.id ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                            </button>
                          </div>
                          <p className="mt-1 truncate text-xs text-white/50">{e.product}</p>
                          {e.duplicate && (
                            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-red-300">
                              <AlertTriangle size={12} /> Duplicate, regenerate with a longer length
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/[0.08] bg-black/30 p-4 text-xs leading-relaxed text-white/50">
                <Info size={15} className="mt-0.5 shrink-0 text-primary" />
                <p>Codes use letters and numbers only, with no confusing characters in the random segment. Uniqueness is checked against every SKU generated in this session.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Generate SKUs in Four Steps</h2>
        <div className="mt-6 space-y-4">
          {[
            { n: '1', t: 'Set your pattern', d: 'Choose a prefix, separator, and target length once. Add brand and category codes that match your catalog structure. These settings apply to every SKU you generate, so your whole catalog stays consistent.' },
            { n: '2', t: 'Enter product details', d: 'Type one product name for single mode, or paste a full list with one product per line for bulk mode. Add a variant code for size or color when one product has multiple versions.' },
            { n: '3', t: 'Generate and check uniqueness', d: 'The tool builds each SKU from your pattern and checks it against the whole session batch. Collisions are regenerated automatically, and any code that cannot be made unique is flagged loudly instead of accepted quietly.' },
            { n: '4', t: 'Copy or download', d: 'Copy individual SKUs, copy the full list as plain text, or download a CSV with product names and SKUs. The CSV opens in Excel or Google Sheets and imports directly into Shopify, WooCommerce, or Amazon inventory files.' },
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

      <SkuGeneratorArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">SKU Generator FAQs</h2>
        <div className="mt-6 space-y-3">
          {SKU_GENERATOR_FAQS.map((f, i) => (
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
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Your Inventory Is Only Half the Battle</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Clean SKUs keep operations running, but customers still need to find your products. Get a free SEO audit and see how to bring more buyers to every product page.
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
