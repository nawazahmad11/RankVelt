// META: title="Free Random Paragraph Generator: Dummy Text in One Click" (max 60 chars, include target keyword)
// META: description="Generate random paragraphs free for mockups and layouts: choose paragraph count and length. No signup." (max 160 chars, include target keyword)

import { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  RefreshCw,
  Sparkles,
  Trash2,
  Type,
} from 'lucide-react';

const PARAGRAPH_FAQS = [
  {
    q: 'What is a random paragraph generator?',
    a: 'It is a small tool that creates placeholder paragraphs for design mockups, layout tests, and demos. You choose how many paragraphs you want and how long they should be, and the tool fills the page with dummy text in seconds. It saves you from typing filler by hand or copying the same block over and over.',
  },
  {
    q: 'Is this paragraph generator free?',
    a: 'Yes, completely. There is no signup, no account, and no limit on how many times you can generate. You can create up to 20 paragraphs per batch and copy them one by one or all at once.',
  },
  {
    q: 'Should I use Lorem Ipsum or plain English placeholder text?',
    a: 'Classic Lorem Ipsum is the safest default: everyone in design recognizes it as filler, so nobody mistakes it for real copy. Plain English word salad reads more like real text at a glance, which helps when you want to judge reading flow, line breaks, and how a layout feels with natural language. For client demos, the plain English style often looks more finished, while Lorem Ipsum keeps the focus on the design itself.',
  },
  {
    q: 'How many paragraphs should I generate for a mockup?',
    a: 'Match the real content as closely as you can. A landing page hero might need one short paragraph, a blog layout needs several medium ones, and a long form article page needs long paragraphs. Testing with too little text hides overflow bugs, and testing with far too much hides spacing problems, so aim for realistic volume.',
  },
  {
    q: 'Is placeholder text bad for SEO?',
    a: 'The tool itself has nothing to do with SEO, but shipping placeholder text to a live page is a real problem. Search engines may index thin filler content, and visitors who land on a page of Lorem Ipsum will leave immediately, which hurts trust and engagement. Keep dummy text on staging sites, block staging from indexing, and replace every placeholder with final copy before launch.',
  },
  {
    q: 'Can I use the generated text in a commercial project?',
    a: 'Yes. Classic Lorem Ipsum is centuries old public domain style filler, and the plain English output is randomly assembled from common words, so there is nothing to license. That said, generated filler is meant for mockups, not for publishing: replace it with real copy written for your audience before anything goes live.',
  },
  {
    q: 'Where does Lorem Ipsum come from?',
    a: 'It comes from a Latin text by the Roman writer Cicero, written in 45 BC. The scrambled version used today was popularized in the 1960s by the type company Letraset, which put it on dry transfer sheets for designers, and it moved into desktop publishing from there. Designers kept it because its natural word lengths mimic real text without distracting readers with readable content.',
  },
  {
    q: 'Why is there a funny random paragraph option?',
    a: 'The plain English word salad style strings together real words in surprising combinations, which makes demos and test pages more fun to look at than gray Latin blocks. Teams use it for internal prototypes, placeholder screens in apps, and anywhere a bit of humor keeps a long review session lighter. It still behaves like real text for layout purposes, with natural sentence and paragraph rhythms.',
  },
];

type Length = 'short' | 'medium' | 'long';
type Style = 'lorem' | 'salad';

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Curabitur pretium tincidunt lacus.',
  'Nulla gravida orci a odio.',
  'Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
  'Integer in mauris eu nibh euismod gravida.',
  'Duis ac tellus et risus vulputate vehicula.',
  'Donec lobortis risus a elit.',
  'Etiam tempor.',
  'Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.',
  'Maecenas fermentum consequat mi.',
  'Donec fermentum.',
  'Pellentesque malesuada nulla a mi.',
  'Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.',
  'Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.',
  'Cras mollis scelerisque nunc.',
  'Nullam arcu.',
];

const NOUNS = [
  'river', 'garden', 'window', 'coffee', 'street', 'mountain', 'library', 'bicycle',
  'lantern', 'harbor', 'forest', 'kitchen', 'bridge', 'cloud', 'market', 'train',
  'mirror', 'valley', 'ocean', 'candle', 'rooftop', 'meadow', 'workshop', 'tunnel',
  'orchard', 'compass', 'backpack', 'notebook', 'fountain', 'balcony', 'canyon',
  'kettle', 'pillow', 'thunder', 'violin', 'telescope',
];

const VERBS = [
  'runs', 'glows', 'waits', 'dances', 'hums', 'drifts', 'shines', 'wanders',
  'sleeps', 'blooms', 'sparkles', 'whispers', 'climbs', 'rests', 'glides', 'echoes',
  'sways', 'twinkles', 'murmurs', 'settles', 'rises', 'lingers', 'tumbles', 'glimmers',
];

const ADJECTIVES = [
  'quiet', 'bright', 'gentle', 'sleepy', 'golden', 'misty', 'cheerful', 'drowsy',
  'vivid', 'soft', 'rustic', 'playful', 'serene', 'crisp', 'hazy', 'warm',
  'ancient', 'brisk', 'mellow', 'luminous',
];

const ADVERBS = [
  'softly', 'slowly', 'brightly', 'quietly', 'eagerly',
  'gracefully', 'boldly', 'gently', 'swiftly', 'warmly',
];

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function makeSaladSentence(): string {
  const n = () => randOf(NOUNS);
  const v = () => randOf(VERBS);
  const a = () => randOf(ADJECTIVES);
  const adv = () => randOf(ADVERBS);
  const templates = [
    `The ${a()} ${n()} ${v()} ${adv()}.`,
    `${cap(n())} and ${n()} ${v()} near the ${a()} ${n()}.`,
    `A ${a()} ${n()} ${v()} while the ${n()} ${v()} ${adv()}.`,
    `${cap(a())} ${n()} ${v()} across the ${a()} ${n()}.`,
    `The ${n()} ${v()} ${adv()} under a ${a()} sky.`,
    `Every ${n()} ${v()} when the ${a()} ${n()} arrives.`,
    `${cap(n())} ${v()} ${adv()} through the ${a()} ${n()}.`,
  ];
  return randOf(templates);
}

function sentencesForLength(length: Length): number {
  if (length === 'short') return 3 + Math.floor(Math.random() * 2);
  if (length === 'medium') return 6 + Math.floor(Math.random() * 3);
  return 10 + Math.floor(Math.random() * 4);
}

function generateParagraphs(count: number, length: Length, style: Style): string[] {
  const out: string[] = [];
  for (let p = 0; p < count; p++) {
    const n = sentencesForLength(length);
    if (style === 'lorem') {
      out.push(shuffle(LOREM_SENTENCES).slice(0, n).join(' '));
    } else {
      const sentences: string[] = [];
      for (let i = 0; i < n; i++) sentences.push(makeSaladSentence());
      out.push(sentences.join(' '));
    }
  }
  return out;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
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

function ParagraphGeneratorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What Is a Random Paragraph Generator?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            A random paragraph generator is a small tool that produces placeholder paragraphs on
            demand. Instead of typing filler by hand or copying the same block of text over and over,
            you choose a paragraph count and length and get clean dummy text in one click. Designers,
            developers, and writers use it whenever a layout needs realistic text volume before the
            final copy exists.
          </p>
          <p>
            The text it produces is called dummy text or placeholder text, and its job is to behave
            like real copy without being read. Classic Lorem Ipsum has been the standard random text
            generator output for decades because its word lengths and sentence rhythms mimic natural
            language. The plain English word salad style on this page does the same thing with readable
            words, which some teams prefer for demos.
          </p>
          <p>
            This is not a writing tool in the creative sense: it will not draft your article or your
            homepage. It is a layout tool. Its value is letting you judge spacing, typography, and
            structure with the right amount of text on the page, long before the real words are ready.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why it matters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why Placeholder Text Still Matters
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Placeholder text catches layout bugs early. A headline that looks perfect over two lines of
            filler may break when the real headline runs to three. A card grid that looks even with
            equal paragraphs reveals its ragged edges the moment one card has more text. Generating
            realistic volumes of dummy text surfaces these problems in the design phase, when fixes are
            cheap.
          </p>
          <p>
            It also keeps projects moving. Copy is almost always the bottleneck: it arrives late,
            changes constantly, and blocks design sign off. With a free paragraph generator, the
            designer builds the full page with credible text volume, the client approves the layout, and
            the writer drops in final copy later without restructuring anything.
          </p>
          <p>
            There is a subtler benefit for demos. Showing a client a page of blank boxes invites feedback
            on the boxes; showing the same page filled with paragraph text invites feedback on the
            design. People react to what looks finished, and placeholder text makes a wireframe feel one
            step closer to real.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How to use</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to Use This Free Paragraph Generator
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Set the paragraph count first, from 1 to 20. To generate random paragraph output that
            matches your layout, mirror the real content you are standing in for: a hero section needs
            one short paragraph, a blog template needs several medium ones, and a long form article
            page needs a run of long paragraphs. The slider shows your count as you drag.
          </p>
          <p>
            Next, pick a length. Short paragraphs run about 40 words, medium about 90, and long about
            150. These are honest approximations, not exact counts, because natural paragraphs vary. If
            you are testing how a layout handles uneven content, generate a mix by running the tool
            twice with different lengths.
          </p>
          <p>
            Then choose a style. Lorem ipsum classic is the neutral default that everyone recognizes as
            filler. Plain English word salad reads like real sentences at a glance, which is better for
            judging reading flow. Press Generate, and if the variation does not feel right, press it
            again for a fresh set. Copy individual paragraphs with the per card buttons, or take
            everything with Copy All.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Style guide</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Lorem Ipsum vs Plain English: Which Style Should You Pick?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Classic Lorem Ipsum is the safest default for one reason: nobody mistakes it for real copy.
            Clients, stakeholders, and teammates see the Latin and instantly understand the words are
            temporary, so all discussion stays on layout, spacing, and hierarchy. If your goal is design
            feedback without copy debates, this lorem ipsum generator style is your pick.
          </p>
          <p>
            Plain English word salad serves a different goal. Because it uses real words, it lets you
            judge how actual reading feels: line breaks land where they would with real sentences, and
            headings sit above text that looks like text. It is also the funnier option, the funny
            random paragraph generator style, which makes long internal reviews and test pages less
            dreary.
          </p>
          <p>
            A practical rule: use Lorem Ipsum when the audience might confuse filler for final copy, and
            use plain English when you want the layout to feel alive. Never mix the two styles on the
            same page unless you are deliberately comparing them; inconsistency draws the eye to the
            text instead of the design.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Avoid these</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common Mistakes With Dummy Text
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The biggest mistake is shipping placeholder text to production. It happens more often than
            anyone admits: a staging page goes live with Lorem Ipsum still in the footer, or a demo
            paragraph survives in a help article. Audit every template before launch, and keep staging
            sites blocked from search engines so filler never gets indexed.
          </p>
          <p>
            The second mistake is wrong volume. Testing a blog layout with one short paragraph hides the
            overflow and pagination issues that real archives have; testing a pricing page with walls of
            filler hides the whitespace problems. Generate roughly the amount of text the real page will
            carry.
          </p>
          <p>
            The third is treating dummy text as a substitute for content strategy. Placeholder text tells
            you the layout works; it does not tell you the message works. Real copy needs its own
            process with its own owner. The generator buys the design team time, but someone still has
            to write the words.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Pro tips</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Testing Layouts Like a Pro With Placeholder Text
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Test at the extremes. Generate a long paragraph and drop it into your narrowest column: if
            the layout survives that, it survives everything. Then test with a single short paragraph to
            check that empty space looks intentional rather than broken. Both extremes reveal different
            bugs, and both take seconds with a paragraph generator.
          </p>
          <p>
            Pair the text with real headings. A page of body copy without headings tests nothing about
            hierarchy, so write three quick headlines and see how they sit above the generated
            paragraphs. Check the combination on mobile too, where long paragraphs can feel endless and
            short ones can look lost.
          </p>
          <p>
            Finally, simulate the content you fear. If your site will one day be translated, generate
            long paragraphs to stand in for languages that expand beyond English. If users will write
            the content themselves, paste the salad text into your CMS and see what an enthusiastic user
            with no design sense does to your template. The generator is cheap; redesigns are not.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">SEO note</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Is Placeholder Text Bad for SEO?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Placeholder text itself is not an SEO factor; publishing it is. If filler ships to a live
            URL, search engines may index a page of meaningless text, and visitors who land on it will
            leave within seconds. That combination, thin content plus poor engagement, is exactly what
            you do not want associated with your domain.
          </p>
          <p>
            The prevention is process, not technology. Keep staging environments behind basic
            authentication or noindex tags, run a pre launch content audit that searches every template
            for lorem, and replace each placeholder with final copy written for a human reader. One stray
            paragraph in a footer can sit unnoticed for months.
          </p>
          <p>
            Used correctly, a dummy text generator never touches your live site at all. It lives in the
            design phase, in mockups and prototypes, and the final copy replaces it before anything is
            published. Think of it as scaffolding: essential while building, embarrassing if left up.
          </p>
        </div>
      </section>
    </>
  );
}

const RELATED_TOOLS = [
  {
    slug: 'sentence-counter',
    title: 'Sentence Counter',
    desc: 'Count sentences, words, and characters in any text.',
  },
  {
    slug: 'business-name-generator',
    title: 'Business Name Generator',
    desc: 'Brainstorm memorable names for your brand or project.',
  },
  {
    slug: 'meta-title-description-checker',
    title: 'Meta Title & Description Checker',
    desc: 'Check title and meta description length for SEO.',
  },
  {
    slug: 'title-tag-preview',
    title: 'Title Tag Preview',
    desc: 'See how your title looks in Google search results.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Choose how many paragraphs you need',
    desc: 'Drag the slider from 1 to 20. Match the real content you are standing in for: a hero needs one, a blog template needs several, a long article page needs a full run.',
  },
  {
    title: 'Pick a length',
    desc: 'Short paragraphs run about 40 words, medium about 90, and long about 150. Run the tool twice with different lengths if you want to test uneven content.',
  },
  {
    title: 'Pick a style',
    desc: 'Lorem ipsum classic is the neutral filler everyone recognizes. Plain English word salad reads like real sentences at a glance and is better for judging reading flow.',
  },
  {
    title: 'Generate and refine',
    desc: 'Press Generate Paragraphs. Do not like the variation? Press it again for a completely fresh set. Every click produces new text.',
  },
  {
    title: 'Copy one paragraph or everything',
    desc: 'Use the copy button on any paragraph card for just that one, or Copy All to grab the full set with blank lines between paragraphs.',
  },
];

const LENGTH_OPTIONS: { value: Length; label: string; desc: string }[] = [
  { value: 'short', label: 'Short', desc: 'About 40 words' },
  { value: 'medium', label: 'Medium', desc: 'About 90 words' },
  { value: 'long', label: 'Long', desc: 'About 150 words' },
];

const STYLE_OPTIONS: { value: Style; label: string; desc: string }[] = [
  { value: 'lorem', label: 'Lorem Ipsum classic', desc: 'Traditional Latin filler' },
  { value: 'salad', label: 'Plain English word salad', desc: 'Readable words, surprising combos' },
];

export default function ParagraphGenerator() {
  const [count, setCount] = useState(3);
  const [length, setLength] = useState<Length>('medium');
  const [style, setStyle] = useState<Style>('lorem');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    const id = 'rankvelt-paragraph-generator-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Random Paragraph Generator',
          url: 'https://www.rankvelt.com/tools/paragraph-generator',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: PARAGRAPH_FAQS.map((f) => ({
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

  const handleGenerate = () => {
    setParagraphs(generateParagraphs(count, length, style));
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const handleClear = () => {
    setParagraphs([]);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const handleCopyOne = async (index: number) => {
    const ok = await copyText(paragraphs[index]);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((cur) => (cur === index ? null : cur)), 1500);
    }
  };

  const handleCopyAll = async () => {
    if (paragraphs.length === 0) return;
    const ok = await copyText(paragraphs.join('\n\n'));
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    }
  };

  const totalWords = paragraphs.reduce((sum, p) => sum + countWords(p), 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
          <Type className="h-4 w-4" /> Free Writing Tool
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Free Random Paragraph Generator
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
          Need placeholder text for a mockup, a layout test, or a demo? This free random paragraph
          generator creates clean dummy text in one click. Choose how many paragraphs you want, pick
          short, medium, or long, and switch between classic Lorem Ipsum and plain English word salad.
          Copy one paragraph at a time or grab everything at once. No signup, no fuss.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div>
              <label htmlFor="pg-count" className="mb-2 block text-sm font-semibold text-white">
                Paragraph count: <span className="text-primary">{count}</span>
              </label>
              <input
                id="pg-count"
                type="range"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-white"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-semibold text-white">Paragraph length</span>
              <div className="grid grid-cols-3 gap-2">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLength(opt.value)}
                    className={`rounded-xl border px-3 py-3 text-center transition ${
                      length === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-white/[0.08] bg-black/40 hover:bg-white/5'
                    }`}
                    aria-pressed={length === opt.value}
                  >
                    <span className={`block text-sm font-bold ${length === opt.value ? 'text-primary' : 'text-white'}`}>
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-xs text-white/60">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-semibold text-white">Text style</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStyle(opt.value)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      style === opt.value
                        ? 'border-primary bg-primary/10'
                        : 'border-white/[0.08] bg-black/40 hover:bg-white/5'
                    }`}
                    aria-pressed={style === opt.value}
                  >
                    <span className={`block text-sm font-bold ${style === opt.value ? 'text-primary' : 'text-white'}`}>
                      {opt.label}
                    </span>
                    <span className="mt-1 block text-xs text-white/60">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-5">
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black"
            >
              <Sparkles className="h-5 w-5" /> Generate Paragraphs
            </button>
            {paragraphs.length > 0 && (
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/5"
              >
                <RefreshCw className="h-4 w-4" /> New variation
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={paragraphs.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copiedAll ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={paragraphs.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white/75 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" /> Clear
            </button>
            {paragraphs.length > 0 && (
              <p className="text-center text-xs text-white/60">
                {paragraphs.length} {paragraphs.length === 1 ? 'paragraph' : 'paragraphs'}, {totalWords} words
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-black text-white">
            Generated text{' '}
            {paragraphs.length > 0 && <span className="text-white/60">({paragraphs.length})</span>}
          </h2>
          {paragraphs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-10 text-center">
              <Type className="mx-auto h-10 w-10 text-white/20" />
              <p className="mt-3 text-white/60">
                Your paragraphs will appear here. Choose your options and press Generate Paragraphs.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {paragraphs.map((p, i) => (
                <div key={i} className="rounded-xl border border-white/[0.08] bg-black/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/60">
                      Paragraph {i + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyOne(i)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/75 hover:bg-white/5"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedIndex === i ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-3 leading-relaxed text-white/75">{p}</p>
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
            <li key={i} className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/20 p-5">
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

      <ParagraphGeneratorArticle />

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Random Paragraph Generator: Frequently Asked Questions
        </h2>
        <div className="mt-6">
          <FaqAccordion faqs={PARAGRAPH_FAQS} />
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
            Ready to Replace the Filler With Copy That Ranks?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">
            Placeholder text gets the layout approved; real content wins the customer. Get a free SEO
            audit and see what your pages need to turn visitors into enquiries.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/strategy-call" className="rounded-lg bg-primary px-6 py-3 font-bold text-black">
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
