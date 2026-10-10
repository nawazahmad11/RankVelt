// META: title="Free Color Contrast Checker: WCAG AA & AAA Ratios" (max 60 chars, include target keyword)
// META: description="Check text color contrast free: WCAG contrast ratios with AA and AAA pass/fail for normal and large text. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Copy,
  Gauge,
  Image as ImageIcon,
  Lightbulb,
  Palette,
  Tags,
  Type,
  X,
} from 'lucide-react';

const COLOR_CONTRAST_FAQS = [
  {
    q: 'What is a good contrast ratio for text?',
    a: 'For normal body text, aim for a contrast ratio of at least 4.5:1, which is the WCAG AA requirement. A ratio of 7:1 meets the stricter AAA level and is ideal for long articles and small text. Large text only needs 3:1 for AA, so headlines have more design freedom. Anything below 3:1 is hard to read for most people and should be reserved for decorative elements, never for text.',
  },
  {
    q: 'What is the difference between WCAG AA and AAA?',
    a: 'AA is the middle conformance level and the target that most accessibility policies reference. AAA is the strictest level with tougher contrast thresholds, and it is not always realistic for every design, which is why WCAG does not require AAA everywhere. In practice, treat AA as your must-pass baseline and AAA as a bonus for body text. This checker shows both levels so you can decide what fits each project.',
  },
  {
    q: 'What counts as large text under WCAG?',
    a: 'WCAG defines large text as at least 18 points (about 24 CSS pixels) in a regular weight, or at least 14 points (about 18.66 CSS pixels) in bold. Everything smaller counts as normal text and faces the stricter 4.5:1 AA threshold. Note that 18px in CSS is not large text, which is a common misunderstanding. When in doubt, test your size against the 24px regular or 18.66px bold cutoffs.',
  },
  {
    q: 'Is this the same as the WebAIM color contrast checker?',
    a: 'It uses the same official WCAG relative luminance formula as the WebAIM color contrast checker, so the ratios match exactly. The Adobe color contrast checker works the same way too. The difference here is the added guidance: you get all four AA and AAA results at once, plus a concrete suggestion for which color to darken or lighten when a pair fails. No account or download is needed for any of them.',
  },
  {
    q: 'How is the contrast ratio calculated?',
    a: 'Each color is converted to its relative luminance, a measure of perceived brightness from 0 for black to 1 for white. The ratio is then (lighter + 0.05) divided by (darker + 0.05), giving a score from 1:1 for identical colors up to 21:1 for black on white. The formula weights green most heavily because human eyes are most sensitive to green light. This page runs that exact math in your browser.',
  },
  {
    q: 'My brand color fails against white. What should I do?',
    a: 'Keep the brand color for large headlines, logos, and decorative elements, where the 3:1 large-text threshold is easier to meet. For body text and buttons, create a darker shade of the same hue and reserve it for text use. Alternatively, place the brand color on a dark background instead of white. Many design systems keep two tokens for this reason, one for graphics and a darker one for text.',
  },
  {
    q: 'Does this tool check for color blindness?',
    a: 'No, this checker measures luminance contrast only, which is what the WCAG contrast rules are based on. Color blindness is a separate concern: two colors can pass the contrast ratio yet still be hard to tell apart for someone with red-green color deficiency. Never use color alone to convey meaning; pair color cues with labels, icons, or patterns. For color vision testing, use a dedicated color blindness simulator alongside this tool.',
  },
  {
    q: 'Should I check every color combination on my website?',
    a: 'Start with the pairs that carry meaning: body text, headings, links, button text, form labels, and error messages. Then check interactive states like hover, focus, and disabled, which often fail even when the default state passes. The efficient approach is to define a small set of approved text-on-background tokens in your design system and test those once. Re-test after any rebrand or theme change, including dark mode.',
  },
];

function normalizeHex(input: string): string | null {
  let h = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return '#' + h.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function mixHex(hex: string, target: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const c = (x: number, y: number): number => Math.round(x + (y - x) * t);
  const toHex = (v: number): string => v.toString(16).padStart(2, '0').toUpperCase();
  return '#' + toHex(c(a.r, b.r)) + toHex(c(a.g, b.g)) + toHex(c(a.b, b.b));
}

interface FixSuggestion {
  role: 'foreground' | 'background';
  action: 'darken' | 'lighten';
  from: string;
  to: string;
  levelName: string;
}

function suggestFix(fgHex: string, bgHex: string, ratio: number): FixSuggestion | null {
  const levels = [
    { name: 'AAA for normal text', min: 7 },
    { name: 'AA for normal text', min: 4.5 },
    { name: 'AA for large text', min: 3 },
  ];
  const target = levels.find((l) => ratio < l.min);
  if (!target) return null;

  const fgLum = relativeLuminance(fgHex);
  const bgLum = relativeLuminance(bgHex);
  const dark =
    fgLum <= bgLum
      ? { hex: fgHex, role: 'foreground' as const }
      : { hex: bgHex, role: 'background' as const };
  const light =
    fgLum <= bgLum
      ? { hex: bgHex, role: 'background' as const }
      : { hex: fgHex, role: 'foreground' as const };

  let darkenTo = dark.hex;
  let darkenT = 1;
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const candidate = mixHex(dark.hex, '#000000', t);
    if (contrastRatio(candidate, light.hex) >= target.min) {
      darkenTo = candidate;
      darkenT = t;
      break;
    }
  }

  let lightenTo = light.hex;
  let lightenT = 1;
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const candidate = mixHex(light.hex, '#FFFFFF', t);
    if (contrastRatio(dark.hex, candidate) >= target.min) {
      lightenTo = candidate;
      lightenT = t;
      break;
    }
  }

  if (darkenT <= lightenT) {
    return { role: dark.role, action: 'darken', from: dark.hex, to: darkenTo, levelName: target.name };
  }
  return { role: light.role, action: 'lighten', from: light.hex, to: lightenTo, levelName: target.name };
}

function gradeFor(ratio: number): { label: string; color: string } {
  if (ratio >= 7) return { label: 'Excellent', color: 'text-emerald-400' };
  if (ratio >= 4.5) return { label: 'Good', color: 'text-emerald-400' };
  if (ratio >= 3) return { label: 'Fair', color: 'text-amber-400' };
  return { label: 'Poor', color: 'text-red-400' };
}

const PRESETS: Array<{ label: string; fg: string; bg: string }> = [
  { label: 'Black on white', fg: '#000000', bg: '#FFFFFF' },
  { label: 'Dark on cream', fg: '#1B1B1F', bg: '#F5F5F0' },
  { label: 'White on blue', fg: '#FFFFFF', bg: '#2563EB' },
  { label: 'Gray on white', fg: '#767676', bg: '#FFFFFF' },
];

const RELATED_TOOLS = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    desc: 'Shrink images to WebP, JPEG, or PNG right in your browser.',
    icon: ImageIcon,
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    desc: 'Generate SEO meta tags and check any page in one place.',
    icon: Tags,
  },
  {
    slug: 'title-tag-preview',
    name: 'Title Tag Preview',
    desc: 'Preview how your title looks in Google search results.',
    icon: Type,
  },
  {
    slug: 'website-speed-test',
    name: 'Website Speed Test',
    desc: 'Check page speed and find what slows your site down.',
    icon: Gauge,
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Enter your colors',
    text: 'Pick with the color picker or paste a hex code for the foreground (your text color) and the background. Both 3-digit and 6-digit hex codes work, with or without the # sign.',
  },
  {
    title: 'See the live ratio',
    text: 'The tool computes the official WCAG contrast ratio instantly, from 1:1 (identical colors, no contrast) up to 21:1 (black on white, maximum contrast).',
  },
  {
    title: 'Read the pass or fail table',
    text: 'Get AA and AAA results for normal text and large text, each shown against its real WCAG threshold, plus a live preview of how the pair actually looks at both sizes.',
  },
  {
    title: 'Fix failures in one click',
    text: 'When a pair falls short, the suggestion box names the exact color to darken or lighten and the hex value that reaches the next WCAG level. Apply it with one click and re-test.',
  },
];

function ColorContrastArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">What a color contrast checker does</h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A color contrast checker measures how readable text is against its background. It takes two
            colors, a foreground (usually your text) and a background, and returns a contrast ratio between
            1:1 and 21:1. The higher the number, the easier the text is to read. This free color contrast
            analyzer runs that measurement for you with no signup and no upload.
          </p>
          <p>
            The math comes from the Web Content Accessibility Guidelines (WCAG), the international standard
            for web accessibility. Every serious contrast ratio checker uses the same formula, including
            well known references like the WebAIM color contrast checker and the Adobe color contrast
            checker. That means a 4.5:1 result here means exactly the same thing everywhere else.
          </p>
          <p>
            Designers use a WCAG contrast checker when choosing palettes, styling buttons, and reviewing
            mockups. Developers use it to verify CSS values before shipping. Content and SEO teams use it
            because readable text keeps visitors on the page longer, and accessibility is part of running a
            quality website. If your site has ever received a complaint that text is hard to read, this is
            the tool that settles the argument with a number.
          </p>
          <p>
            This particular checker goes one step further than most thin tools. When a pair fails, it tells
            you exactly which color to darken or lighten, and by how much, to reach the next WCAG level.
            That turns a failed test into a fix in one click, instead of leaving you to guess your way to a
            passing shade.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why it matters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why accessible color contrast affects your business
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Millions of people live with color vision deficiency, and many more read your site with aging
            eyes, screen glare, or low brightness. For all of them, low contrast text is not a minor
            annoyance. It is a wall between them and your content, and most of them will leave rather than
            struggle through it.
          </p>
          <p>
            In the United States, inaccessible websites have drawn ADA-related legal attention for years,
            and contrast is one of the most commonly cited issues because it is so easy to measure. You do
            not need legal trouble to care, though. Every visitor who squints at your pricing page and
            leaves is a lost sale, and a color accessibility checker is the cheapest way to find those
            problems before customers do.
          </p>
          <p>
            There is also a plain usability angle. High contrast text scans faster, which matters on mobile
            where much of your traffic arrives. Buttons with strong contrast get noticed and tapped. Form
            labels people can actually read get filled in. Accessible color contrast is one of those rare
            fixes that helps every single visitor, including those with perfect vision.
          </p>
          <p>
            Search engines do not score your contrast ratio directly, but they do measure what happens when
            text is unreadable: higher bounce rates, shorter sessions, and fewer conversions. A contrast
            check belongs in the same pre-launch routine as your spell check and your mobile preview.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The math</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How the WCAG contrast ratio is calculated
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The formula starts with relative luminance, a number from 0 for pure black to 1 for pure white
            that represents how bright a color looks to the human eye. Each red, green, and blue channel is
            first linearized, because screens do not emit light in a straight line, then the channels are
            combined with fixed weights: green counts most at about 71 percent, red at about 21 percent,
            and blue at about 7 percent.
          </p>
          <p>
            Once both colors have a luminance value, the contrast ratio is the lighter value plus 0.05,
            divided by the darker value plus 0.05. Identical colors score 1:1. Black text on a white
            background scores 21:1, the maximum possible. Everything on the web falls somewhere between
            those two extremes.
          </p>
          <p>
            WCAG then sets pass marks on that scale. For normal text, AA requires 4.5:1 and AAA requires
            7:1. For large text, defined as 24px or larger (or 18.66px and larger when bold), AA requires
            3:1 and AAA requires 4.5:1. These thresholds are the reason the results table on this page
            shows four separate rows instead of a single vague score.
          </p>
          <p>
            One honest caveat: the WCAG 2 formula measures luminance only, not hue difference, and
            researchers have proposed a successor method for the next version of the guidelines. For now,
            the 4.5:1 and 3:1 thresholds remain the standard that auditors and accessibility statements
            reference, so they are the numbers worth designing to.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Reading results</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to read your AA and AAA results
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            This tool reports four results for every pair: AA and AAA for normal text, and AA and AAA for
            large text. Each row shows the required threshold next to a clear pass or fail badge, so there
            is no guessing about what the ratio means. The live preview underneath shows the pair rendered
            as real text at both sizes, because numbers alone never tell the full visual story.
          </p>
          <p>
            Treat AA for normal text as your baseline. If your body copy, navigation, and form labels pass
            4.5:1, your site meets the level most accessibility policies require. AAA at 7:1 is a worthy
            stretch goal for articles and documentation where people read for minutes at a time, and it is
            easier to reach than most designers expect once they darken body text one step.
          </p>
          <p>
            Large text gets relaxed thresholds because bigger, bolder letterforms stay legible at lower
            contrast. That is why a brand color that fails as body text can still be perfectly fine as a
            large headline. Use this distinction deliberately: reserve lower contrast brand colors for large
            display type, and keep body text in high contrast neutrals.
          </p>
          <p>
            Beyond text, WCAG 2.1 added a 3:1 requirement for user interface components and meaningful
            graphics, things like input borders, focus outlines, and icons that carry information. This
            checker tests text pairs, so check borders and icons against their adjacent colors separately,
            using the same 3:1 bar as your guide.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common contrast mistakes this tool catches
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most common failure is light gray body text. Shades like #999999 or #AAAAAA on white look
            elegant in a mockup and fail AA badly in production. If your grays are decorative, keep them for
            borders and dividers, not for sentences people must read. Test any gray you use for copy; most
            of them fail.
          </p>
          <p>
            Placeholder text inside form fields is another repeat offender. Browsers render placeholders in
            a faded gray by default, and many sites never override it, leaving instructions that a large
            share of users cannot read. Visible labels above the field plus a placeholder color that passes
            4.5:1 fix the problem completely.
          </p>
          <p>
            Text over images and gradients cannot be judged from two hex codes alone, because the background
            varies across the text. This tool tests solid colors, so for image overlays, sample the lightest
            area behind the text, or add a scrim (a dark translucent layer) and test against that. If the
            pair passes on the lightest patch, it passes everywhere.
          </p>
          <p>
            States get forgotten. A button that passes in its default state often fails on hover, focus, or
            disabled. Disabled buttons are exempt from WCAG contrast rules, but a disabled state that users
            cannot read still confuses them, so aim for 3:1 there as a courtesy. Test every state, not just
            the resting one.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Fixing failures</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to fix a failing color pair without ruining your design
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The fix is almost always about lightness, not hue. Nudging a color darker or lighter preserves
            the brand feel while moving the ratio fast. Shifting the hue changes the identity of the color
            and usually upsets whoever picked it, so leave the hue alone and work the lightness slider.
          </p>
          <p>
            When a pair fails, change only one color, and change the one with the most room to move. Dark
            text on a light background usually wants darker text. Light text on a brand color usually wants
            a lighter text or a darker background. The suggestion box above does this math for you: it tests
            both directions and recommends the smaller change, naming the exact hex value that passes.
          </p>
          <p>
            For recurring brand colors, create a text-safe variant in your palette. Many teams keep tokens
            like primary for graphics and a darker primary-text variant approved for copy. Document which
            token goes where, so future pages inherit the accessible choice instead of reintroducing the
            failing shade six months later.
          </p>
          <p>
            After fixing, re-check the pair in context: dark mode, hover states, and the actual font and
            size in use. A pair that passes at 16px can still feel thin at 12px even when the math says it
            passes, so treat the ratio as the floor of good typography, not the ceiling.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Workflow</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          A practical workflow for accessible color contrast
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Start new projects by testing your core palette before a single page is designed. Run every text
            color against every background it will sit on: page background, cards, buttons, alerts, and
            footers. Ten minutes here prevents months of one-off fixes after launch.
          </p>
          <p>
            For existing sites, audit the highest traffic templates first: homepage, pricing, checkout, and
            contact pages. Those are the pages where unreadable text costs the most money. Work through
            components systematically rather than spot-checking random pages, and keep a simple list of
            failing pairs with their fixes.
          </p>
          <p>
            Bake the check into your process. Add contrast review to your design QA checklist, and re-run it
            after any rebrand, theme update, or dark mode launch. Colors drift over time as new shades sneak
            into the codebase, and a quarterly pass keeps the palette honest.
          </p>
          <p>
            Remember what this tool does not test. Contrast is one slice of accessibility: keyboard
            navigation, screen reader labels, and focus order matter just as much and need their own checks.
            Use this checker for the color slice, then keep going. An accessible site is a better site for
            everyone, and for your business.
          </p>
        </div>
      </section>
    </>
  );
}

export default function ColorContrastChecker() {
  const [fgText, setFgText] = useState('#1B1B1F');
  const [bgText, setBgText] = useState('#FFFFFF');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const fgValid = normalizeHex(fgText);
  const bgValid = normalizeHex(bgText);
  const ratio = fgValid && bgValid ? contrastRatio(fgValid, bgValid) : null;
  const suggestion = fgValid && bgValid && ratio !== null ? suggestFix(fgValid, bgValid, ratio) : null;
  const grade = ratio !== null ? gradeFor(ratio) : null;

  const results =
    ratio !== null
      ? [
          { label: 'Normal text, AA', threshold: '4.5:1', pass: ratio >= 4.5 },
          { label: 'Normal text, AAA', threshold: '7:1', pass: ratio >= 7 },
          { label: 'Large text, AA', threshold: '3:1', pass: ratio >= 3 },
          { label: 'Large text, AAA', threshold: '4.5:1', pass: ratio >= 4.5 },
        ]
      : [];

  useEffect(() => {
    const id = 'rankvelt-color-contrast-checker-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Color Contrast Checker',
          url: 'https://www.rankvelt.com/tools/color-contrast-checker',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: COLOR_CONTRAST_FAQS.map((f) => ({
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

  const copyHex = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    if (suggestion.role === 'foreground') setFgText(suggestion.to);
    else setBgText(suggestion.to);
  };

  const swapColors = () => {
    setFgText(bgText);
    setBgText(fgText);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <section>
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Free Design Tool</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Free Color Contrast Checker
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            This free color contrast analyzer checks any text color against any background color. Enter two
            colors to get the exact WCAG contrast ratio, see AA and AAA pass or fail results for normal and
            large text, and get a concrete fix suggestion when a pair falls short. It works like the WebAIM
            color contrast checker and the Adobe color contrast checker, but runs entirely in your browser
            with no signup.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-black/20 p-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-white">Your colors</h2>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="fg-color" className="text-sm font-bold text-white/75">
                    Foreground (text color)
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="fg-color"
                      type="color"
                      value={fgValid ?? '#000000'}
                      onChange={(e) => setFgText(e.target.value)}
                      className="h-12 w-14 cursor-pointer rounded-lg border border-white/[0.08] bg-transparent"
                      aria-label="Foreground color picker"
                    />
                    <input
                      type="text"
                      value={fgText}
                      onChange={(e) => setFgText(e.target.value)}
                      placeholder="#1B1B1F"
                      spellCheck={false}
                      className="w-full rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3 font-mono text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                      aria-label="Foreground hex code"
                    />
                  </div>
                  {!fgValid && (
                    <p className="mt-2 text-sm text-red-400">
                      Enter a valid hex color, for example #1B1B1F or #FFF.
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapColors}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-primary" />
                    Swap colors
                  </button>
                </div>

                <div>
                  <label htmlFor="bg-color" className="text-sm font-bold text-white/75">
                    Background color
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="bg-color"
                      type="color"
                      value={bgValid ?? '#FFFFFF'}
                      onChange={(e) => setBgText(e.target.value)}
                      className="h-12 w-14 cursor-pointer rounded-lg border border-white/[0.08] bg-transparent"
                      aria-label="Background color picker"
                    />
                    <input
                      type="text"
                      value={bgText}
                      onChange={(e) => setBgText(e.target.value)}
                      placeholder="#FFFFFF"
                      spellCheck={false}
                      className="w-full rounded-lg border border-white/[0.08] bg-black/20 px-4 py-3 font-mono text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                      aria-label="Background hex code"
                    />
                  </div>
                  {!bgValid && (
                    <p className="mt-2 text-sm text-red-400">
                      Enter a valid hex color, for example #FFFFFF or #FFF.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-white/75">Try an example</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setFgText(p.fg);
                          setBgText(p.bg);
                        }}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/60 transition hover:border-white/20 hover:text-white"
                      >
                        <span
                          className="h-4 w-4 rounded border border-white/20"
                          style={{ backgroundColor: p.bg, color: p.fg }}
                        />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-black/20 p-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-white">Results</h2>
              </div>

              {ratio !== null && fgValid && bgValid && grade ? (
                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-white/60">
                        Contrast ratio
                      </p>
                      <p className="mt-1 text-5xl font-black text-white">
                        {ratio.toFixed(2)}
                        <span className="text-2xl text-white/60">:1</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${grade.color}`}>{grade.label}</p>
                      <button
                        type="button"
                        onClick={() => copyHex(`${fgValid} on ${bgValid} = ${ratio.toFixed(2)}:1`)}
                        className="mt-2 flex items-center gap-1 text-xs font-bold text-white/60 transition hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? 'Copied' : 'Copy result'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {results.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.08] px-4 py-3"
                      >
                        <span className="text-sm font-bold text-white/75">{r.label}</span>
                        <span className="flex items-center gap-3">
                          <span className="text-xs text-white/60">needs {r.threshold}</span>
                          {r.pass ? (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-400">
                              <Check className="h-3 w-3" /> Pass
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-black text-red-400">
                              <X className="h-3 w-3" /> Fail
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-lg border border-white/[0.08] p-4"
                      style={{ backgroundColor: bgValid, color: fgValid }}
                    >
                      <p className="text-sm font-bold">Normal text sample</p>
                      <p className="mt-1 text-base">
                        The quick brown fox jumps over the lazy dog at 16px.
                      </p>
                    </div>
                    <div
                      className="rounded-lg border border-white/[0.08] p-4"
                      style={{ backgroundColor: bgValid, color: fgValid }}
                    >
                      <p className="text-sm font-bold">Large text sample</p>
                      <p className="mt-1 text-2xl font-bold">Large headline at 24px bold</p>
                    </div>
                  </div>

                  {suggestion ? (
                    <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
                      <p className="text-sm font-black text-amber-300">Suggested fix</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        To reach {suggestion.levelName}, {suggestion.action} the {suggestion.role} from{' '}
                        <span className="font-mono font-bold text-white">{suggestion.from}</span> to{' '}
                        <span className="font-mono font-bold text-white">{suggestion.to}</span>.
                      </p>
                      <button
                        type="button"
                        onClick={applySuggestion}
                        className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black transition hover:opacity-90"
                      >
                        Apply this fix
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
                      <p className="text-sm leading-relaxed text-white/75">
                        This pair passes every WCAG level, including AAA for normal text. No changes
                        needed.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-white/[0.08] p-8 text-center">
                  <p className="text-white/60">
                    Enter two valid hex colors to see the contrast ratio, pass or fail results, and fix
                    suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Check contrast in four steps</h2>
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

      <ColorContrastArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {COLOR_CONTRAST_FAQS.map((f, i) => (
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
            Accessibility is one piece of a healthy website. Get a full technical SEO audit of your site,
            free, and see exactly what is holding your rankings back.
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
