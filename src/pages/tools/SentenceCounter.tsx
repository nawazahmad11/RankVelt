// META: title="Free Sentence Counter: Count Sentences, Words & Paragraphs"
// META: description="Count sentences, words, characters and paragraphs free with RankVelt's sentence counter. Paste text and get instant counts, no signup."

import { useEffect, useMemo, useState } from 'react';
import {
  AlignLeft,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Eraser,
  Hash,
  Pilcrow,
  Trash2,
  Type,
} from 'lucide-react';

const SENTENCE_COUNTER_FAQS = [
  {
    q: 'How do you count sentences in a paragraph?',
    a: 'Paste or type the paragraph into the text box above and the sentence counter splits it on sentence-ending punctuation (periods, exclamation marks, and question marks) while ignoring periods that belong to abbreviations such as Mr., Dr., e.g., and i.e. The count updates live as you type, so you can edit and watch the number change. Each chunk that ends with terminal punctuation and contains real words counts as one sentence.',
  },
  {
    q: 'What counts as a sentence in this tool?',
    a: 'Any stretch of text that ends with a period, exclamation mark, question mark, or ellipsis and contains at least one letter or number counts as one sentence. Quoted speech like "Stop!" she said. counts as two sentences, because the quoted exclamation ends one thought and the narration starts another. Stray punctuation with no words attached, such as a lone "..." on its own line, is not counted.',
  },
  {
    q: 'How does the sentence counter handle abbreviations like Mr., Dr., and e.g.?',
    a: 'Before splitting, the tool temporarily protects the periods inside a built-in list of common abbreviations, including titles (Mr., Mrs., Ms., Dr., Prof.), Latin shortenings (e.g., i.e., etc., vs.), time markers (a.m., p.m.), and initials-style forms (U.S., U.K., Ph.D.). Decimal numbers like 3.14 are protected the same way, so they never split a sentence in two. After the split, the original text is restored, so your counts stay accurate while the text you see never changes.',
  },
  {
    q: 'Is this sentence counter really free?',
    a: 'Yes. The sentence counter is completely free with no signup, no account, and no usage limits. Everything runs inside your own browser, so your text is never uploaded to a server or stored anywhere. You can paste documents of any reasonable length and count as often as you like.',
  },
  {
    q: 'Does it also work as a word counter, character counter, and paragraph counter?',
    a: 'Yes. Alongside the sentence count you get a live word count, a character count with spaces, a character count without spaces, and a paragraph count. Paragraphs are detected as blocks of text separated by blank lines. You also get an estimated reading time and your average words per sentence, which makes it a complete little writing-metrics toolkit in one box.',
  },
  {
    q: 'What is a good average number of words per sentence?',
    a: 'For web writing, many editors aim for an average of roughly 15 to 20 words per sentence, because shorter sentences are easier to scan on a screen. That is a guideline, not a rule: the best writing mixes short punchy sentences with longer flowing ones for rhythm. If your average climbs above 25, try splitting a few long sentences and see if the text reads more clearly. If it sits under 10, check whether the writing feels choppy and could use an occasional longer sentence.',
  },
  {
    q: 'Can I use it for long documents, essays, or articles?',
    a: 'Yes. The counter handles long documents without trouble, because the counting logic runs locally in your browser and updates as you type. Paste a full essay, blog post, or chapter and you will still get instant sentence, word, character, and paragraph counts. Since nothing is uploaded, long private documents stay private on your own device.',
  },
  {
    q: 'Why is my sentence count different from Microsoft Word or Google Docs?',
    a: 'Different tools use different rules. Some counters split on every period, so abbreviations like "Dr." inflate their sentence count. Others skip text inside headers, footers, or text boxes, which lowers the count. This tool documents its rule plainly: it splits on terminal punctuation and protects a defined list of abbreviations and decimals. If you need a count you can explain and defend, a documented rule beats a black-box number.',
  },
];

/* ------------------------------------------------------------------ */
/* Sentence splitting logic                                            */
/* ------------------------------------------------------------------ */

const ABBREVIATIONS = [
  'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Sr', 'Jr', 'St',
  'Ave', 'Blvd', 'Rd', 'Dept', 'Inc', 'Ltd', 'Co', 'Corp',
  'Rep', 'Sen', 'Gov', 'Gen', 'Sgt', 'Capt', 'Lt', 'Col',
  'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Sept',
  'Oct', 'Nov', 'Dec',
  'Mon', 'Tue', 'Tues', 'Wed', 'Thu', 'Thur', 'Thurs', 'Fri', 'Sat', 'Sun',
  'a.m', 'p.m', 'A.M', 'P.M',
  'e.g', 'i.e', 'etc', 'vs', 'cf',
  'Ph.D', 'M.D', 'B.A', 'M.A', 'U.S', 'U.K', 'D.C', 'E.U',
];

const TOKEN_START = '\uE000';
const TOKEN_END = '\uE001';

function splitSentences(text: string): string[] {
  const tokens: string[] = [];
  const stash = (s: string): string => {
    tokens.push(s);
    return `${TOKEN_START}${tokens.length - 1}${TOKEN_END}`;
  };

  let working = text;
  // Protect decimal numbers such as 3.14 so the period never splits a sentence.
  working = working.replace(/(\d)\.(\d)/g, (_m, a: string, b: string) => stash(`${a}.${b}`));
  // Protect known abbreviations such as Mr. Dr. e.g. i.e.
  for (const abbr of ABBREVIATIONS) {
    const pattern = new RegExp(`\\b${abbr.replace(/\./g, '\\.')}\\.`, 'gi');
    working = working.replace(pattern, (m: string) => stash(m));
  }

  const restore = (s: string): string =>
    s.replace(new RegExp(`${TOKEN_START}(\\d+)${TOKEN_END}`, 'g'), (_m, n: string) => tokens[Number(n)] ?? '');

  const matches = working.match(/[^.!?…]+(?:[.!?…]+|$)/g) ?? [];
  return matches
    .map((m) => restore(m).trim())
    .filter((s) => /[\p{L}\p{N}]/u.test(s));
}

interface TextStats {
  sentences: number;
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  readingTime: string;
  avgWordsPerSentence: string;
}

function analyzeText(text: string): TextStats {
  const sentences = splitSentences(text).length;
  const words = text
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  let readingTime = '0 sec';
  if (words > 0) {
    const totalSeconds = Math.max(1, Math.ceil((words / 200) * 60));
    if (totalSeconds < 60) {
      readingTime = `${totalSeconds} sec`;
    } else {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      readingTime = secs === 0 ? `${mins} min` : `${mins} min ${secs} sec`;
    }
  }

  return {
    sentences,
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    readingTime,
    avgWordsPerSentence: sentences > 0 ? (words / sentences).toFixed(1) : '0',
  };
}

const SAMPLE_TEXT =
  'Dr. Ahmed arrived at 9 a.m. with the quarterly report. It showed a 3.5 percent lift in conversions, e.g. from clearer headlines and shorter paragraphs. Mrs. Khan asked whether shorter sentences would keep readers on the page longer. They would. Short sentences are easy to scan, and scanners become readers when the first lines feel effortless.';

const HOW_IT_WORKS = [
  {
    title: 'Paste or type your text',
    text: 'Drop any text into the box: a paragraph, a full article, an essay, or a product description. There is no upload and no signup, and the box accepts text of any reasonable length.',
  },
  {
    title: 'Watch the counts update live',
    text: 'Sentences, words, characters with and without spaces, and paragraphs are counted instantly as you type. You never have to press a button or wait for a server.',
  },
  {
    title: 'Check readability signals',
    text: 'Look at your average words per sentence and the estimated reading time. These two numbers tell you at a glance whether the text is tight and scannable or dense and tiring.',
  },
  {
    title: 'Edit, copy, or start over',
    text: 'Revise right in the box and watch the metrics move, copy the text to your clipboard, or clear everything with one click and paste the next draft.',
  },
];

const RELATED_TOOLS = [
  {
    slug: 'paragraph-generator',
    name: 'Random Paragraph Generator',
    desc: 'Generate placeholder paragraphs for mockups, layouts, and wireframes.',
  },
  {
    slug: 'meta-title-description-checker',
    name: 'Meta Title & Description Checker',
    desc: 'Check title tag and meta description length for any page.',
  },
  {
    slug: 'title-tag-preview',
    name: 'Title Tag Preview',
    desc: 'See how your title tag looks in Google search results.',
  },
  {
    slug: 'bulk-email-extractor',
    name: 'Bulk Email Extractor',
    desc: 'Extract email addresses from a list of websites in bulk.',
  },
];

export default function SentenceCounter() {
  const [text, setText] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyzeText(text), [text]);

  useEffect(() => {
    const id = 'rankvelt-sentence-counter-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Sentence Counter',
          url: 'https://www.rankvelt.com/tools/sentence-counter',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: SENTENCE_COUNTER_FAQS.map((f) => ({
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

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const statCards = [
    { icon: AlignLeft, label: 'Sentences', value: String(stats.sentences) },
    { icon: Type, label: 'Words', value: stats.words.toLocaleString() },
    { icon: Hash, label: 'Characters', value: stats.characters.toLocaleString() },
    { icon: Eraser, label: 'Characters (no spaces)', value: stats.charactersNoSpaces.toLocaleString() },
    { icon: Pilcrow, label: 'Paragraphs', value: String(stats.paragraphs) },
    { icon: Clock, label: 'Reading time', value: stats.readingTime },
    { icon: BarChart3, label: 'Avg words / sentence', value: stats.avgWordsPerSentence },
  ];

  return (
    <main className="min-h-screen">
      {/* Tool UI card */}
      <section className="mx-auto max-w-4xl px-4 pt-12">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
            Free Writing Tool
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Free Sentence Counter
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Count sentences in any text instantly with this free online sentence counter.
            Paste your writing below and get live counts of sentences, words, characters,
            and paragraphs, plus reading time and average words per sentence. It runs
            entirely in your browser, handles tricky abbreviations like Mr. and e.g.,
            and needs no signup.
          </p>

          <div className="mt-6">
            <label htmlFor="sentence-counter-input" className="mb-2 block text-sm font-bold text-white/75">
              Your text
            </label>
            <textarea
              id="sentence-counter-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste or type your text here to count its sentences..."
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/40 p-4 text-base leading-relaxed text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setText(SAMPLE_TEXT)}
              className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white"
            >
              Load sample text
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy text'}
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-white/[0.08] bg-black/40 p-4"
              >
                <div className="flex items-center gap-2 text-white/60">
                  <card.icon size={15} className="text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{card.label}</span>
                </div>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">{card.value}</p>
              </div>
            ))}
            <div className="col-span-2 flex items-center rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:col-span-3 lg:col-span-1">
              <p className="text-xs leading-relaxed text-white/60">
                {text.trim()
                  ? 'Counts update live as you type. Abbreviations and decimals are protected from false splits.'
                  : 'Your results appear here the moment you add text.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Count sentences in four quick steps
        </h2>
        <ol className="mt-6 space-y-4">
          {HOW_IT_WORKS.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-white/[0.08] bg-black/20 p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-black">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <SentenceCounterArticle />

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Sentence counter FAQs
        </h2>
        <div className="mt-6 space-y-3">
          {SENTENCE_COUNTER_FAQS.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-white/[0.08] bg-black/20">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-bold text-white">{f.q}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-primary transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-white/75 sm:text-base">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Keep going</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Related free tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="rounded-xl border border-white/[0.08] bg-black/20 p-5 transition hover:border-white/20"
            >
              <p className="font-bold text-white">{t.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{t.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-4xl px-4 pb-20">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-black tracking-tight text-white">
            Want your whole website to read this clearly?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">
            Clear sentences are only the start. RankVelt audits your content, technical SEO,
            and AI search visibility, then shows you exactly what to fix to win more customers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/strategy-call"
              className="rounded-lg bg-primary px-6 py-3 font-bold text-black transition hover:opacity-90"
            >
              Get a Free SEO Audit
            </a>
            <a
              href="/tools"
              className="rounded-lg border border-white/[0.08] px-6 py-3 font-bold text-white transition hover:border-white/20"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SentenceCounterArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What counts as a sentence?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Most people answer this question without thinking: a sentence starts with a capital
            letter and ends with a period, exclamation mark, or question mark. That definition
            works for schoolbook examples, but real writing is messier. Marketing copy uses
            fragments for punch. Technical writing is full of abbreviations, decimals, version
            numbers, and times of day. Dialogue mixes quoted speech with narration. Any honest
            answer to "how do you count sentences" has to deal with all of that, which is why a
            purpose-built sentence counter beats eyeballing it.
          </p>
          <p>
            This online sentence counter uses a simple, documented rule. It treats any stretch
            of text ending in a period, exclamation mark, question mark, or ellipsis as one
            sentence, as long as the stretch contains at least one letter or number. That means
            "Are you coming?" counts, "Stop!" counts, and a trailing thought like "Well..."
            counts too. A lone "..." sitting on its own line does not count, because there is no
            actual thought attached to it.
          </p>
          <p>
            The tricky part is knowing what should not split a sentence. A naive counter sees
            the period in "Dr." and starts a brand new sentence, which is obviously wrong. This
            tool protects a built-in list of common abbreviations before it splits, so titles
            like Mr., Mrs., and Ms., Latin shortenings like e.g., i.e., and etc., time markers
            like a.m. and p.m., and forms like U.S. and Ph.D. never cause false breaks. Decimal
            numbers such as 3.14 get the same protection. Knowing the rule matters: if you ever
            need to explain your count to an editor, a client, or a teacher, you can point to
            exactly how it was produced.
          </p>
          <p>
            One more edge worth knowing: headings and bullet points usually lack terminal
            punctuation, so they fold into the surrounding text or get skipped depending on
            your line breaks. If you paste a page with lots of headings, the paragraph counter
            and the sentence count together give you a fair picture, but a headline like "Sale
            ends Friday" with no period will not register as its own sentence. That matches how
            most professional counters behave, and it keeps the number meaningful instead of
            inflated.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why it matters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why writers, marketers, and students count sentences
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Sentence count is one of the fastest diagnostic checks in editing. When a draft feels
            heavy but you cannot say why, the numbers often reveal it: too few sentences for the
            word count means the sentences are too long, and readers are getting lost inside
            them. Copywriters use this check on landing pages because dense blocks of long
            sentences quietly kill conversions. Nobody fills out a form after giving up halfway
            through a paragraph.
          </p>
          <p>
            Students meet sentence counting from the other direction: assignments that ask for a
            set number of sentences per paragraph or per answer. Counting by hand is slow and
            error prone, especially under a deadline, and miscounting can cost marks. A counter
            sentence check takes seconds and removes the doubt. Teachers benefit too, since a
            quick paste shows whether a submission meets the structural requirement before they
            start grading the substance.
          </p>
          <p>
            For content teams, sentence metrics feed into content audits. When you refresh old
            blog posts, comparing sentence counts and average sentence length before and after
            the rewrite shows whether the new version is genuinely more readable or just
            reshuffled. Translation and localization workflows also care about sentence counts,
            because translators often work sentence by sentence and quotes are sometimes built
            that way. In each case the value is the same: a small, objective number that keeps
            everyone honest about the shape of the text.
          </p>
          <p>
            There is also a plain quality-of-life argument. Writers who check their metrics
            regularly develop an instinct for rhythm. You start to feel when three long sentences
            in a row need a short one after them, the way a drummer feels a missing beat. The
            counter does not replace that instinct, but it trains it faster by showing you the
            pattern in numbers while the feeling is still fresh.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Reading your results</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to read your sentence counter results
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The headline number is the sentence count itself, but the supporting metrics tell
            the real story. Start with average words per sentence: divide-heavy text with an
            average above 25 words per sentence will feel academic or bureaucratic to most web
            readers, while an average under 10 can feel choppy, like a string of telegrams.
            For general web writing, many editors treat 15 to 20 words as a comfortable middle
            ground, then deliberately break the pattern with very short sentences for emphasis.
          </p>
          <p>
            Reading time translates the word count into something a busy reader understands.
            It assumes about 200 words per minute, which is a common estimate for average adult
            reading speed on screens. Use it to sanity-check your formats: if a "quick tip"
            article shows a six-minute reading time, either the promise or the draft needs to
            change. Newsletters, product pages, and onboarding emails all benefit from matching
            the stated time commitment to the real one.
          </p>
          <p>
            The character counter earns its keep wherever limits are strict. Social bios, ad
            headlines, SMS messages, and form fields all cut you off at fixed character counts,
            and the no-spaces variant matches how some platforms and tools measure. The
            paragraph counter, meanwhile, reveals structure: a 600-word article with only two
            paragraphs is a wall of text no matter how good the sentences are, while twelve
            short paragraphs signal the kind of scannable layout that keeps mobile readers
            scrolling.
          </p>
          <p>
            Read the metrics together, not in isolation. Ten sentences averaging 12 words each
            across five paragraphs is a breezy, readable piece. Ten sentences averaging 30 words
            each in a single paragraph is a chore. The numbers do not judge your writing; they
            describe its shape, and the shape predicts how readers will experience it before
            they read a single word.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Under the hood</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          The abbreviation problem, and how this tool solves it
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Abbreviations are the reason cheap sentence counters get it wrong. Consider one
            ordinary sentence: "Dr. Smith met Mr. Jones at 9 a.m. to discuss Q3." A naive
            splitter sees four periods and reports four sentences. A human sees one. The gap
            between those two answers is the entire engineering challenge of sentence
            counting, and most thin online tools never close it because they split on every
            period and call it a day.
          </p>
          <p>
            This counter sentence tool closes the gap with a protection pass. Before splitting,
            it scans the text for a curated list of abbreviations and decimal numbers and
            temporarily shields their periods from the splitter. Titles (Mr., Mrs., Ms., Dr.,
            Prof.), organizational shortenings (Inc., Ltd., Dept.), months and weekdays (Jan.,
            Fri.), Latin forms (e.g., i.e., etc., vs.), clock times (a.m., p.m.), dotted
            initials (U.S., U.K., Ph.D.), and decimals like 3.14 all survive the split intact.
            Only genuine terminal punctuation, the kind that actually ends a thought, creates a
            new sentence.
          </p>
          <p>
            No list can cover every abbreviation in every field. Legal writing, medicine, and
            engineering all have domain-specific shortenings that a general list will miss, and
            an unusual abbreviation at the end of a sentence can still cause a false split. The
            honest approach is to document the list, which this page does, rather than pretend
            the problem is fully solved. For general business, academic, and web writing, the
            built-in list handles the cases you will actually meet.
          </p>
          <p>
            There is a useful side effect to this design: the tool is predictable. Because the
            rule is stated plainly, you can reason about edge cases in advance instead of
            discovering surprises after you publish. Predictability is what separates a
            professional instrument from a toy, and it is the main thing missing from the thin
            counter pages that currently rank for this keyword.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Common mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Mistakes people make when counting sentences by hand
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most common hand-counting mistake is treating every line as a sentence. Pasted
            text from PDFs and web pages often breaks lines in odd places, so counting line
            breaks instead of terminal punctuation inflates the number fast. The second classic
            is the abbreviation trap described above: "She arrived at 8 p.m. sharp." gets
            counted as two sentences by anyone scanning for periods instead of thoughts.
          </p>
          <p>
            Dialogue causes the third kind of error. In fiction and interview transcripts,
            quoted speech and narration interleave, and counters disagree about where one
            sentence ends and the next begins. This tool counts the quoted exclamation and the
            narration that follows as separate sentences, which matches standard editorial
            practice. If your style guide says otherwise, at least you know exactly where the
            difference comes from.
          </p>
          <p>
            A subtler mistake is trusting a black-box count without checking its rules. Word
            processors differ: one may count text inside text boxes and footnotes while another
            skips them, and hyphenation handling varies too. When two tools disagree, the right
            question is not "which number is correct" but "which rule fits my purpose." For
            readability analysis, a documented rule applied consistently beats a mysterious
            number every time.
          </p>
          <p>
            Finally, people forget that fragments count in real writing. Marketing copy leans on
            fragments for rhythm ("Faster. Cheaper. Done."), and each one is doing the work of
            a sentence even though no grammar textbook would bless it. A counter that only
            recognizes textbook sentences would miss the actual structure of modern copy. This
            one counts what functions as a sentence, which is what you need when you are
            editing for readers rather than diagramming for a exam.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">SEO and readability</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Sentence length, readability, and SEO
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Search engines do not count your sentences and assign a score, so let us be clear
            about what sentence metrics can and cannot do for SEO. What they can do is measure
            readability, and readability drives the behaviors that search engines do notice:
            how long visitors stay, whether they scroll, whether they bounce back to the
            results. A page that is easy to read keeps people around; a page that exhausts
            them sends them back. Sentence length is one of the levers you control.
          </p>
          <p>
            Short sentences also suit the way answers get surfaced today. Featured snippets and
            AI-generated answers favor content that states one clear idea per sentence, because
            clear sentences are easy to extract and quote. A 45-word sentence carrying three
            ideas is hard to lift cleanly; three 15-word sentences practically quote
            themselves. You do not need to write for machines, but writing in extractable
            units happens to serve both machines and humans.
          </p>
          <p>
            Mobile reading raises the stakes further. On a phone screen, a 30-word sentence can
            run to five or six lines, and a paragraph of such sentences looks like a wall even
            when the ideas are good. Checking average words per sentence during your edit pass
            is a cheap way to catch mobile-hostile copy before it ships. Pair it with the
            paragraph count: short paragraphs of short sentences are the native format of the
            small screen.
          </p>
          <p>
            The trap to avoid is optimizing the number instead of the writing. An article with
            a perfect average of 17 words per sentence can still be dull if every sentence has
            the same shape. Use the metrics as a diagnostic, then fix the prose with judgment:
            split the sentence that buries its point, merge the two choppy ones that belong
            together, and let rhythm, not arithmetic, have the last word.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Best practices</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Best practices for strong, readable sentences
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Put one idea in each sentence. This is the single highest-leverage habit in
            practical writing. When a sentence starts doing two jobs, split it; the second idea
            usually deserves its own emphasis anyway. Readers process one idea per sentence
            effortlessly, and editors can cut or move single-idea sentences without breaking
            their neighbors.
          </p>
          <p>
            Vary your lengths on purpose. A paragraph of identical medium-length sentences
            drones, no matter how correct each one is. Follow a long, winding sentence with a
            short one. Let a fragment land a punch, then explain it in the next sentence. The
            average words per sentence shown above is most useful as a check on variety: if
            every sentence in your draft sits between 18 and 22 words, the average looks fine
            while the rhythm is flat.
          </p>
          <p>
            Read the draft aloud, or at least mouth it. Your ear catches run-on sentences that
            your eye skips, because running out of breath is a physical signal that a sentence
            is too long. Professional copywriters do this as a matter of routine, and it takes
            less time than any other editing pass with comparable payoff. If you stumble, your
            reader will stumble harder.
          </p>
          <p>
            Finally, cut filler at the sentence level rather than the word level. Phrases like
            "in order to," "due to the fact that," and "it is important to note that" add words
            without adding meaning, and they train readers to skim. Deleting them shortens
            sentences and sharpens them at the same time. Run the counter before and after a
            tightening pass: the sentence count often rises while the word count falls, which
            is exactly the signature of clearer writing.
          </p>
        </div>
      </section>
    </>
  );
}
