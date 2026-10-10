// META: title="Free Markup Calculator: Price From Cost & Margin" (max 60 chars, include target keyword)
// META: description="Calculate product markup free: cost to price, margin to markup, and reverse markup with instant results. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  Barcode,
  Calculator,
  ChevronDown,
  Copy,
  DollarSign,
  Lightbulb,
  Percent,
  Shuffle,
  TrendingUp,
} from 'lucide-react';

const MARKUP_FAQS = [
  {
    q: 'How do you calculate markup percentage?',
    a: 'Subtract the cost from the selling price, divide by the cost, and multiply by 100. For example, a product that costs $40 and sells for $60 has a markup of (60 - 40) / 40 x 100 = 50%. Note that you divide by the cost, not the price. Dividing by the price gives you the margin instead, which is a different number.',
  },
  {
    q: 'What is the difference between markup and margin?',
    a: 'Markup is profit expressed as a percentage of cost, while margin is profit expressed as a percentage of selling price. A $40 product sold for $60 has a 50% markup but only a 33.3% margin, because the same $20 profit is measured against different bases. Markup will always be the higher number when both are positive. Mixing them up is the most common pricing mistake in retail.',
  },
  {
    q: 'How do I convert a 40% margin to markup?',
    a: 'Use the formula markup = margin / (100 - margin) x 100. For a 40% margin that is 40 / 60 x 100 = 66.67% markup. Going the other way, margin = markup / (100 + markup) x 100, so a 66.67% markup converts back to a 40% margin. The converter mode on this page does both directions instantly.',
  },
  {
    q: 'What is reverse markup and when would I use it?',
    a: 'Reverse markup works backward from a known selling price and markup percentage to find the original cost. Use it when a supplier quotes a retail price, when you are checking a competitor\'s pricing, or when marketplace fees force you to recompute what you can afford to pay. The formula is cost = price / (1 + markup / 100). It is also handy for checking whether a wholesaler\'s numbers actually add up.',
  },
  {
    q: 'Is a 50% markup the same as a 50% margin?',
    a: 'No, and the gap is large. A 50% markup means you add half the cost on top, so a $40 cost becomes a $60 price, which is a 33.3% margin. A 50% margin means half the selling price is profit, so the same $40 cost needs an $80 price, which is a 100% markup. Always confirm which one a supplier, partner, or tutorial means before you set prices.',
  },
  {
    q: 'What is a good markup percentage for retail?',
    a: 'It depends on the category, your costs, and what the market will pay, so there is no universal right number. Many gift, apparel, and home goods retailers use keystone pricing, which is a 100% markup that doubles the cost and equals a 50% margin. Start from the margin you need after fees, shipping, and returns, then convert it to a markup target. Test prices against real demand instead of copying a competitor\'s sticker price blindly.',
  },
  {
    q: 'Can profit margin be more than 100%?',
    a: 'No. Margin is profit divided by selling price, and profit can never exceed the price itself, so margin tops out just under 100%. Markup has no such ceiling: a 300% markup simply means the price is four times the cost. If a calculator ever shows a margin above 100%, one of the inputs is wrong.',
  },
  {
    q: 'Should I set prices using markup or margin?',
    a: 'Set your target as a margin, because margin tells you what share of each sale you actually keep after costs. Then convert that margin into the markup you apply to your costs when pricing products. This page\'s cost plus margin mode does exactly that in one step. Using markup alone feels simpler, but it hides how much of the final price is profit.',
  },
];

type Mode = 'markup' | 'costMargin' | 'converter' | 'reverse';
type ConverterDirection = 'marginToMarkup' | 'markupToMargin';

const MODES: Array<{ id: Mode; label: string; hint: string }> = [
  { id: 'markup', label: 'Cost + markup', hint: 'Price from cost and markup %' },
  { id: 'costMargin', label: 'Cost + margin', hint: 'Price from cost and target margin %' },
  { id: 'converter', label: 'Margin / markup converter', hint: 'Convert between margin and markup' },
  { id: 'reverse', label: 'Reverse markup', hint: 'Find cost from price and markup %' },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function fmtMoney(n: number): string {
  return currency.format(n);
}

function fmtPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/[$,%]/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

interface ResultRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface CalcResult {
  error: string | null;
  rows: ResultRow[];
  formula: string;
  example: string;
}

function calculate(
  mode: Mode,
  costRaw: string,
  pctRaw: string,
  priceRaw: string,
  direction: ConverterDirection,
): CalcResult {
  const cost = parseNum(costRaw);
  const pct = parseNum(pctRaw);
  const price = parseNum(priceRaw);

  if (mode === 'markup') {
    if (cost === null || pct === null)
      return { error: null, rows: [], formula: 'Price = Cost x (1 + Markup% / 100)', example: 'Example: a $40 cost with 50% markup gives a $60 price.' };
    if (cost < 0 || pct < 0)
      return { error: 'Cost and markup must be zero or positive.', rows: [], formula: '', example: '' };
    const sellPrice = cost * (1 + pct / 100);
    const profit = sellPrice - cost;
    return {
      error: null,
      rows: [
        { label: 'Selling price', value: fmtMoney(sellPrice), highlight: true },
        { label: 'Markup amount (profit per unit)', value: fmtMoney(profit) },
        { label: 'Your cost', value: fmtMoney(cost) },
        { label: 'Markup percentage', value: fmtPct(pct) },
      ],
      formula: 'Price = Cost x (1 + Markup% / 100)',
      example: `Example: a ${fmtMoney(cost)} cost with ${fmtPct(pct)} markup gives a ${fmtMoney(sellPrice)} price.`,
    };
  }

  if (mode === 'costMargin') {
    if (cost === null || pct === null)
      return { error: null, rows: [], formula: 'Price = Cost / (1 - Margin% / 100)', example: 'Example: a $40 cost with a 40% margin target gives a $66.67 price.' };
    if (cost < 0 || pct < 0)
      return { error: 'Cost and margin must be zero or positive.', rows: [], formula: '', example: '' };
    if (pct >= 100)
      return { error: 'Margin must be below 100%. A margin of 100% or more is mathematically impossible.', rows: [], formula: '', example: '' };
    const sellPrice = cost / (1 - pct / 100);
    const profit = sellPrice - cost;
    const equivMarkup = cost === 0 ? 0 : (profit / cost) * 100;
    return {
      error: null,
      rows: [
        { label: 'Selling price', value: fmtMoney(sellPrice), highlight: true },
        { label: 'Profit per unit', value: fmtMoney(profit) },
        { label: 'Equivalent markup', value: fmtPct(equivMarkup) },
        { label: 'Your margin', value: fmtPct(pct) },
      ],
      formula: 'Price = Cost / (1 - Margin% / 100)',
      example: `Example: a ${fmtMoney(cost)} cost with a ${fmtPct(pct)} margin target gives a ${fmtMoney(sellPrice)} price, which equals ${fmtPct(equivMarkup)} markup.`,
    };
  }

  if (mode === 'converter') {
    if (pct === null)
      return {
        error: null,
        rows: [],
        formula:
          direction === 'marginToMarkup'
            ? 'Markup% = Margin% / (100 - Margin%) x 100'
            : 'Margin% = Markup% / (100 + Markup%) x 100',
        example:
          direction === 'marginToMarkup'
            ? 'Example: a 40% margin converts to 66.67% markup.'
            : 'Example: a 66.67% markup converts to a 40% margin.',
      };
    if (pct < 0)
      return { error: 'The percentage must be zero or positive.', rows: [], formula: '', example: '' };
    if (direction === 'marginToMarkup') {
      if (pct >= 100)
        return { error: 'Margin must be below 100% to convert.', rows: [], formula: '', example: '' };
      const markup = (pct / (100 - pct)) * 100;
      return {
        error: null,
        rows: [
          { label: 'Markup percentage', value: fmtPct(markup), highlight: true },
          { label: 'Your margin', value: fmtPct(pct) },
        ],
        formula: 'Markup% = Margin% / (100 - Margin%) x 100',
        example: `A ${fmtPct(pct)} margin equals ${fmtPct(markup)} markup.`,
      };
    }
    const margin = (pct / (100 + pct)) * 100;
    return {
      error: null,
      rows: [
        { label: 'Margin percentage', value: fmtPct(margin), highlight: true },
        { label: 'Your markup', value: fmtPct(pct) },
      ],
      formula: 'Margin% = Markup% / (100 + Markup%) x 100',
      example: `A ${fmtPct(pct)} markup equals a ${fmtPct(margin)} margin.`,
    };
  }

  if (price === null || pct === null)
    return { error: null, rows: [], formula: 'Cost = Price / (1 + Markup% / 100)', example: 'Example: a $60 price with 50% markup implies a $40 cost.' };
  if (price < 0 || pct < 0)
    return { error: 'Price and markup must be zero or positive.', rows: [], formula: '', example: '' };
  const impliedCost = price / (1 + pct / 100);
  const profit = price - impliedCost;
  const marginPct = price === 0 ? 0 : (profit / price) * 100;
  return {
    error: null,
    rows: [
      { label: 'Original cost', value: fmtMoney(impliedCost), highlight: true },
      { label: 'Markup amount', value: fmtMoney(profit) },
      { label: 'Equivalent margin', value: fmtPct(marginPct) },
      { label: 'Selling price', value: fmtMoney(price) },
    ],
    formula: 'Cost = Price / (1 + Markup% / 100)',
    example: `Example: a ${fmtMoney(price)} price with ${fmtPct(pct)} markup implies a ${fmtMoney(impliedCost)} cost.`,
  };
}

const RELATED_TOOLS = [
  {
    slug: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    desc: 'Work out gross and net margins from revenue and costs.',
    icon: Percent,
  },
  {
    slug: 'sku-generator',
    name: 'SKU Generator',
    desc: 'Create clean product SKUs for your inventory.',
    icon: Barcode,
  },
  {
    slug: 'business-name-generator',
    name: 'Business Name Generator',
    desc: 'Brainstorm brandable names for your store.',
    icon: Lightbulb,
  },
  {
    slug: 'bulk-redirect-generator',
    name: 'Bulk Redirect Generator',
    desc: 'Generate redirect rules for site migrations.',
    icon: Shuffle,
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Pick a calculation mode',
    text: 'Choose cost plus markup, cost plus margin, the margin to markup converter, or reverse markup. Each mode solves a different pricing question, and all four update live as you type.',
  },
  {
    title: 'Enter your numbers',
    text: 'Type your product cost, selling price, or percentage. The calculator accepts plain numbers and ignores $ and % signs, so paste values straight from your spreadsheet.',
  },
  {
    title: 'Read the instant results',
    text: 'See the selling price, profit per unit, and the converted percentage side by side, so markup and margin never get confused. Every result shows the formula behind it.',
  },
  {
    title: 'Apply it to your price list',
    text: 'Use the converted markup to price products from cost, or copy the margin-safe price into your store. Re-run the numbers whenever costs, fees, or targets change.',
  },
];

function MarkupArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a markup calculator does</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A markup calculator answers a simple question: if a product costs you a certain amount, what
            should you sell it for? Enter your cost and your target markup percentage, and this free
            percent markup calculator returns the selling price and the profit per unit instantly. No
            signup, no spreadsheet formulas to memorize.
          </p>
          <p>
            This page is actually four calculators in one. The classic mode prices from cost plus markup.
            The cost plus margin mode works backward from the margin you want to keep. The margin to markup
            converter translates between the two percentages, and reverse markup finds the original cost
            from a known price. Together they cover every direction of the pricing math an online seller
            needs.
          </p>
          <p>
            It is built for ecommerce sellers, retailers, wholesalers, and anyone who prices physical or
            digital products. Every result shows the formula behind it, so you learn how to calculate
            markup as you use it instead of trusting a black box.
          </p>
          <p>
            If you have ever searched for a markup calculator online and wondered which of the four modes
            fits your situation, the short version is at the top of this page and the full guide is below.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Markup vs margin</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Markup vs margin: the difference that costs sellers money
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Markup and margin both describe profit, but they divide by different numbers. Markup divides
            profit by cost: (price minus cost) divided by cost. Margin divides profit by price: (price
            minus cost) divided by price. Same profit, different base, different answer.
          </p>
          <p>
            Take a product that costs $40 and sells for $60. The profit is $20. The markup is 20 divided by
            40, which is 50%. The margin is 20 divided by 60, which is 33.3%. One product, two true
            numbers, and quoting the wrong one in a negotiation or a business plan changes every downstream
            decision.
          </p>
          <p>
            Markup is the natural language of pricing: you mark up what you paid. Margin is the natural
            language of business health: it tells you what fraction of revenue you keep. Sellers usually set
            prices with markup math, then report and plan with margin math, which is exactly why a margin vs
            markup calculator earns a permanent place in your bookmarks.
          </p>
          <p>
            The expensive mistake is treating the two as interchangeable. A supplier who offers a 50%
            margin is offering far more profit than one who offers a 50% markup. Whenever anyone quotes a
            percentage, ask which base they mean before you agree to anything.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The formulas</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to calculate markup percentage by hand
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The formula for how to calculate markup percentage is: (selling price minus cost) divided by
            cost, multiplied by 100. Three steps, no special tools needed, and it works the same whether
            you sell handmade goods or wholesale electronics.
          </p>
          <p>
            Worked example: you buy phone cases at $12 each and sell them at $29.99. Subtract first: 29.99
            minus 12 equals 17.99 profit. Divide by cost: 17.99 divided by 12 equals about 1.499. Multiply
            by 100: roughly 150% markup. That single number now lets you compare this product against
            everything else you sell.
          </p>
          <p>
            To go the other direction, from cost and markup to price, use: price equals cost multiplied by
            (1 plus markup divided by 100). A $25 cost with an 80% markup gives 25 times 1.8, which is $45.
            This is the price markup calculator mode at the top of the page, and it is the one formula to
            memorize if you memorize one.
          </p>
          <p>
            Sanity check your answer every time. A markup over 100% simply means the price is more than
            double the cost, which is normal in many categories. A negative markup means you priced below
            cost, which is occasionally a deliberate loss leader but is usually a typo worth catching.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Conversion</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to convert margin to markup (and back)
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Conversion comes up constantly: your accountant talks margin, your supplier talks markup, and
            your pricing sheet needs both. The formulas are: markup equals margin divided by (100 minus
            margin), times 100; and margin equals markup divided by (100 plus markup), times 100.
          </p>
          <p>
            Some conversions are worth knowing by heart. A 20% margin equals a 25% markup. A 25% margin
            equals a 33.33% markup. A 30% margin equals a 42.86% markup. A 40% margin equals a 66.67%
            markup. A 50% margin equals a 100% markup. Notice the pattern: as margin climbs, the equivalent
            markup accelerates.
          </p>
          <p>
            Going the other way: 25% markup is a 20% margin, 50% markup is a 33.33% margin, 100% markup is
            a 50% margin, and 200% markup is a 66.67% margin. If these feel unintuitive, that is the point:
            human intuition handles the conversion badly, which is why the converter mode on this page
            exists.
          </p>
          <p>
            A practical rule: when someone gives you a margin target, convert it to markup before you touch
            your price list, because your price list is built on costs. Pricing directly from a margin
            number without converting is how sellers accidentally underprice by ten to twenty points.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Reverse markup</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">When to use reverse markup</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Reverse markup starts from the selling price and works back to the cost: cost equals price
            divided by (1 plus markup divided by 100). If a competitor sells at $90 with what you estimate
            is a 50% markup, their cost basis is around $60. The reverse markup calculator mode above does
            this in one step.
          </p>
          <p>
            Supplier negotiations are the classic use case. A wholesaler quotes a suggested retail price and
            you want to know what cost that implies at your required margin. Run it in reverse before you
            agree to terms, and you will spot quotes that leave you no room to profit.
          </p>
          <p>
            It is also useful for auditing your own numbers. Marketplace fees, shipping, and returns
            silently raise your true cost, and reversing from your actual net proceeds shows whether your
            original markup still holds after those deductions. Many sellers discover their real markup is
            far lower than the spreadsheet claimed.
          </p>
          <p>
            One caution: reverse markup tells you the implied cost, not the true cost. Competitors may have
            volume discounts or loss-leader strategies you cannot see. Use it to inform your pricing, not
            to copy someone else's numbers blindly.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Retail pricing</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Retail markup strategy: pricing beyond the formula
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The formula gives you a price; strategy decides whether it is the right price. Start from the
            margin you need after every cost: product, shipping, packaging, marketplace fees, returns, and
            tax handling. Convert that required margin to a markup with the converter above, and you have a
            floor price, not a target price.
          </p>
          <p>
            Many retail categories traditionally use keystone pricing: a 100% markup that doubles the cost
            and yields a 50% margin. It is a rule of thumb, not a law. Categories with heavy competition or
            high return rates need more room, while high-volume commodities survive on less. Treat keystone
            as a starting point for discussion, not a verdict.
          </p>
          <p>
            Then consider the market. A retail markup calculator tells you what you need; customers tell you
            what they will pay. If your floor price sits above what comparable products charge, you need
            lower costs or a more differentiated product, not wishful thinking. If it sits below, test
            higher prices: most sellers underprice out of caution, not data.
          </p>
          <p>
            Finally, present the price well. Charm pricing, bundle pricing, and clear value framing all move
            conversion without touching your markup. The math gets you to a defensible price; merchandising
            gets the customer to say yes.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common markup mistakes to avoid
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The number one mistake is applying the markup percentage to the price instead of the cost. A
            50% markup applied to a $60 price gives $90, but markup is defined on cost, and confusing the
            base quietly corrupts every price on the sheet. Always ask: percentage of what?
          </p>
          <p>
            The second is setting a markup target when you meant a margin target. Keeping 40% of every
            sale is a margin goal, and pricing it as a 40% markup leaves you with only a 28.6% margin.
            Convert first, price second, and this entire class of error disappears.
          </p>
          <p>
            The third is forgetting the hidden costs. Shipping materials, payment processing, platform
            commissions, and returns all come out of the same sale. Build them into your cost before you
            calculate markup, or calculate on product cost and then verify that the resulting margin covers
            everything else.
          </p>
          <p>
            The fourth is rounding carelessly. Rounding $47.33 down to $46.99 feels harmless, but across
            thousands of units it trims your margin measurably. Round deliberately, check the margin after
            rounding, and remember that small pricing discipline compounds faster than any single clever
            tactic.
          </p>
        </div>
      </section>
    </>
  );
}

export default function MarkupCalculator() {
  const [mode, setMode] = useState<Mode>('markup');
  const [cost, setCost] = useState('40');
  const [pct, setPct] = useState('50');
  const [price, setPrice] = useState('60');
  const [direction, setDirection] = useState<ConverterDirection>('marginToMarkup');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const result = calculate(mode, cost, pct, price, direction);

  useEffect(() => {
    const id = 'rankvelt-markup-calculator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Markup Calculator',
          url: 'https://www.rankvelt.com/tools/markup-calculator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: MARKUP_FAQS.map((f) => ({
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

  const copySummary = async () => {
    if (result.error || result.rows.length === 0) return;
    const text = result.rows.map((r) => `${r.label}: ${r.value}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <section>
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            Free eCommerce Calculator
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Free Markup Calculator
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            Calculate product markup free with this percentage markup calculator. Price from cost and
            markup, work backward from a target margin, convert margin to markup, or run a reverse markup
            to find cost from price. Results update instantly as you type, and every mode shows the exact
            formula behind the numbers. No signup needed.
          </p>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Calculator modes">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                    mode === m.id
                      ? 'bg-primary text-black'
                      : 'border border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/60">
              {MODES.find((m) => m.id === mode)?.hint}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-6">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-black text-white">Your numbers</h2>
                </div>

                <div className="mt-6 space-y-5">
                  {(mode === 'markup' || mode === 'costMargin') && (
                    <>
                      <div>
                        <label htmlFor="mc-cost" className="text-sm font-bold text-white/75">
                          Product cost ($)
                        </label>
                        <input
                          id="mc-cost"
                          type="text"
                          inputMode="decimal"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          placeholder="40"
                          className={`mt-2 ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="mc-pct" className="text-sm font-bold text-white/75">
                          {mode === 'markup' ? 'Markup percentage (%)' : 'Target margin percentage (%)'}
                        </label>
                        <input
                          id="mc-pct"
                          type="text"
                          inputMode="decimal"
                          value={pct}
                          onChange={(e) => setPct(e.target.value)}
                          placeholder="50"
                          className={`mt-2 ${inputClass}`}
                        />
                        {mode === 'costMargin' && (
                          <p className="mt-2 text-xs text-white/60">
                            Margin must be below 100%. A 100% margin is mathematically impossible.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {mode === 'converter' && (
                    <>
                      <div>
                        <span className="text-sm font-bold text-white/75">Conversion direction</span>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setDirection('marginToMarkup')}
                            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                              direction === 'marginToMarkup'
                                ? 'bg-primary text-black'
                                : 'border border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            Margin <ArrowLeftRight className="h-4 w-4" /> Markup
                          </button>
                          <button
                            type="button"
                            onClick={() => setDirection('markupToMargin')}
                            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                              direction === 'markupToMargin'
                                ? 'bg-primary text-black'
                                : 'border border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            Markup <ArrowLeftRight className="h-4 w-4" /> Margin
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="mc-conv" className="text-sm font-bold text-white/75">
                          {direction === 'marginToMarkup'
                            ? 'Margin percentage (%)'
                            : 'Markup percentage (%)'}
                        </label>
                        <input
                          id="mc-conv"
                          type="text"
                          inputMode="decimal"
                          value={pct}
                          onChange={(e) => setPct(e.target.value)}
                          placeholder={direction === 'marginToMarkup' ? '40' : '66.67'}
                          className={`mt-2 ${inputClass}`}
                        />
                      </div>
                    </>
                  )}

                  {mode === 'reverse' && (
                    <>
                      <div>
                        <label htmlFor="mc-price" className="text-sm font-bold text-white/75">
                          Selling price ($)
                        </label>
                        <input
                          id="mc-price"
                          type="text"
                          inputMode="decimal"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="60"
                          className={`mt-2 ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="mc-rev-pct" className="text-sm font-bold text-white/75">
                          Markup percentage (%)
                        </label>
                        <input
                          id="mc-rev-pct"
                          type="text"
                          inputMode="decimal"
                          value={pct}
                          onChange={(e) => setPct(e.target.value)}
                          placeholder="50"
                          className={`mt-2 ${inputClass}`}
                        />
                      </div>
                    </>
                  )}

                  <div className="rounded-lg border border-white/[0.08] bg-black/20 p-4">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60">
                      <TrendingUp className="h-4 w-4 text-primary" /> Formula used
                    </p>
                    <p className="mt-2 font-mono text-sm text-white/75">{result.formula || 'Enter valid numbers to see the formula.'}</p>
                    {result.example && (
                      <p className="mt-2 text-sm text-white/60">{result.example}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-black text-white">Live results</h2>
                  </div>
                  {result.rows.length > 0 && !result.error && (
                    <button
                      type="button"
                      onClick={copySummary}
                      className="flex items-center gap-1 text-xs font-bold text-white/60 transition hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? 'Copied' : 'Copy results'}
                    </button>
                  )}
                </div>

                {result.error ? (
                  <div className="mt-6 rounded-lg border border-red-400/20 bg-red-400/5 p-5">
                    <p className="text-sm font-bold text-red-300">Check your inputs</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{result.error}</p>
                  </div>
                ) : result.rows.length > 0 ? (
                  <div className="mt-6 space-y-2">
                    {result.rows.map((r) => (
                      <div
                        key={r.label}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                          r.highlight
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-white/[0.08]'
                        }`}
                      >
                        <span className="text-sm font-bold text-white/75">{r.label}</span>
                        <span
                          className={`font-mono text-lg font-black ${
                            r.highlight ? 'text-primary' : 'text-white'
                          }`}
                        >
                          {r.value}
                        </span>
                      </div>
                    ))}
                    <p className="pt-2 text-xs leading-relaxed text-white/60">
                      Results update live as you type. The highlighted row is the answer this mode was
                      built to find.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-dashed border-white/[0.08] p-8 text-center">
                    <p className="text-white/60">
                      Enter your numbers on the left and the results will appear here instantly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Price with confidence in four steps</h2>
        <ol className="mt-6 space-y-4">
          {HOW_IT_WORKS.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/20 p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-white">{s.title}</p>
                <p className="mt-1 leading-relaxed text-white/60">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <MarkupArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {MARKUP_FAQS.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-white/[0.08] bg-black/20">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="font-bold text-white">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-5 leading-relaxed text-white/75">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.22em] text-primary">
          Keep exploring
        </p>
        <h2 className="mt-3 text-center text-3xl font-black tracking-tight text-white">
          Related free tools
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="rounded-xl border border-white/[0.08] bg-black/20 p-6 transition hover:border-white/20"
            >
              <t.icon className="h-6 w-6 text-primary" />
              <p className="mt-4 font-bold text-white">{t.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-black tracking-tight text-white">Get a Free SEO Audit</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/60">
            Smart pricing deserves traffic to match. Get a full technical SEO audit of your store, free,
            and see exactly what is holding your rankings back.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/strategy-call"
              className="rounded-lg bg-primary px-8 py-3 font-bold text-black transition hover:opacity-90"
            >
              Get a Free SEO Audit
            </a>
            <a
              href="/tools"
              className="rounded-lg border border-white/[0.08] px-8 py-3 font-bold text-white transition hover:border-white/20"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
