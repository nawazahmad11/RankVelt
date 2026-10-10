// META: title="Free Image Compressor: Compress to WebP, JPEG & PNG"
// META: description="Compress images free in your browser: convert to WebP, shrink JPEG and PNG file sizes with no upload and no signup."

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Download,
  FileImage,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

const IMAGE_COMPRESSOR_FAQS = [
  {
    q: 'How can I reduce picture file size?',
    a: 'The three levers are dimensions, format, and quality. First shrink oversized dimensions: a 4000px photo displayed at 800px wide carries five times more pixels than it needs. Then pick an efficient format: WebP is usually much smaller than JPEG at similar quality, and far smaller than PNG for photos. Finally lower the quality setting until you can just barely see a difference, often around 70 to 85 for WebP and JPEG. This tool applies all three in your browser with a live before and after size comparison.',
  },
  {
    q: 'What is WebP, and should I convert my images to it?',
    a: 'WebP is a modern image format that produces noticeably smaller files than JPEG at similar visual quality, and it supports transparency like PNG. All current browsers, including Chrome, Safari, Firefox, and Edge, display WebP images, so it is safe to use on public websites. Converting with this free WebP image compressor is one of the simplest page-speed wins available: smaller images load faster, which helps both visitors and search rankings. Choose PNG only when you need pixel-perfect graphics such as logos with sharp edges.',
  },
  {
    q: 'Can I compress an image to exactly 100KB?',
    a: 'You can set a target size, for example 100KB, and the tool will step the quality down level by level until the file fits under your target. It reports the quality level it landed on so you can judge whether the result still looks good. There is a limit to honesty here: a very detailed photo cannot always reach 100KB without visible damage, and if the smallest usable quality still exceeds the target, the tool tells you by showing the final size. In that case, reducing the max dimension usually gets you the rest of the way.',
  },
  {
    q: 'Can I compress an animated GIF online with this tool?',
    a: 'You can upload a GIF, but with an important caveat: converting it to WebP, JPEG, or PNG captures only the first frame, so the animation is lost. Canvas-based compression in the browser cannot currently re-encode animation. If you need a small animated image, convert the GIF to an animated WebP with dedicated software first, then compress still images here. For everything that does not move, this image compressor to WebP or JPEG will shrink the file dramatically.',
  },
  {
    q: 'Do my images get uploaded to a server?',
    a: 'No. Every step, reading the file, resizing, and re-encoding, happens locally in your browser using the Canvas API. Your images never leave your device, which means there is no upload wait, no account, and no privacy concern for client work or personal photos. You can even disconnect from the internet after the page loads and keep compressing.',
  },
  {
    q: 'Which format should I choose: WebP, JPEG, or PNG?',
    a: 'Choose WebP for almost everything: photos, product shots, and blog images. It gives the smallest files at good quality and every modern browser supports it. Choose JPEG only when you specifically need maximum compatibility with very old software. Choose PNG for graphics with sharp lines, text, or flat colors, such as logos and screenshots, where lossless quality matters more than file size. Note that the quality slider has little effect on PNG output because PNG compression is lossless by design.',
  },
  {
    q: 'Will compression make my images look bad?',
    a: 'Not if you stay in the sensible range. WebP and JPEG quality settings between 70 and 85 look clean to the human eye for typical photos, while cutting file size enormously compared to quality 100 or an uncompressed PNG. Damage becomes visible when you push quality very low or compress an already-compressed file repeatedly, so always compress from the highest-quality original you have. The before and after preview lets you zoom in and check with your own eyes before downloading.',
  },
  {
    q: 'Are there limits on file size or the number of images?',
    a: 'You can add as many images as you like in one batch, and each file can be up to 30MB. Very large batches are limited only by your device memory, since everything is processed locally. If a file is skipped, the tool tells you why, for example because it is not an image or it exceeds the size cap. Compressed files download one by one or all at once with sequential downloads.',
  },
];

/* ------------------------------------------------------------------ */
/* Types and helpers                                                   */
/* ------------------------------------------------------------------ */

type OutFormat = 'image/webp' | 'image/jpeg' | 'image/png';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  status: 'ready' | 'processing' | 'done' | 'error';
  outUrl: string | null;
  outSize: number | null;
  outWidth: number | null;
  outHeight: number | null;
  usedQuality: number | null;
  outName: string;
  error: string | null;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatLabel(format: OutFormat): string {
  if (format === 'image/webp') return 'WebP';
  if (format === 'image/jpeg') return 'JPEG';
  return 'PNG';
}

function extensionFor(format: OutFormat): string {
  if (format === 'image/webp') return 'webp';
  if (format === 'image/jpeg') return 'jpg';
  return 'png';
}

const QUALITY_LADDER = [0.92, 0.85, 0.78, 0.7, 0.62, 0.54, 0.46, 0.38, 0.3, 0.22, 0.15, 0.08];

async function compressOne(
  item: ImageItem,
  format: OutFormat,
  quality: number,
  maxDim: number,
  targetKb: number | null,
  revokePrevious: (url: string | null) => void,
): Promise<Partial<ImageItem>> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(item.file);
  } catch {
    throw new Error('Could not read this image. It may be corrupt or in an unsupported format.');
  }

  try {
    let w = bitmap.width;
    let h = bitmap.height;
    if (w === 0 || h === 0) {
      throw new Error('Could not read this image. It may be corrupt or in an unsupported format.');
    }
    if (maxDim > 0 && Math.max(w, h) > maxDim) {
      const scale = maxDim / Math.max(w, h);
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas is not supported in this browser.');
    }
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blobFor = (q: number): Promise<Blob | null> =>
      new Promise((resolve) => {
        canvas.toBlob(resolve, format, q);
      });

    let blob: Blob | null = null;
    let usedQ = quality;

    if (targetKb !== null && targetKb > 0 && format !== 'image/png') {
      const targetBytes = Math.floor(targetKb * 1024);
      for (const q of QUALITY_LADDER) {
        const candidate = await blobFor(q);
        if (!candidate) continue;
        blob = candidate;
        usedQ = q;
        if (candidate.size <= targetBytes) break;
      }
    } else {
      blob = await blobFor(quality);
    }

    if (!blob) {
      throw new Error('Compression failed for this image. Try a different format.');
    }

    const base = item.name.replace(/\.[a-z0-9]+$/i, '') || 'image';
    revokePrevious(item.outUrl);
    return {
      status: 'done',
      outUrl: URL.createObjectURL(blob),
      outSize: blob.size,
      outWidth: w,
      outHeight: h,
      usedQuality: usedQ,
      outName: `${base}-compressed.${extensionFor(format)}`,
      error: null,
    };
  } finally {
    bitmap.close();
  }
}

const HOW_IT_WORKS = [
  {
    title: 'Add your images',
    text: 'Drag and drop images onto the box or click to browse. You can add a whole batch at once; each file can be up to 30MB. Nothing is uploaded anywhere.',
  },
  {
    title: 'Choose format, quality, and size',
    text: 'Pick WebP, JPEG, or PNG, set the quality slider, optionally cap the max dimension, and optionally set a target file size in KB. WebP at quality 80 is a great default.',
  },
  {
    title: 'Compress in your browser',
    text: 'Hit Compress images and watch each file shrink. You get before and after sizes, dimensions, and the percentage saved for every file, plus batch totals.',
  },
  {
    title: 'Download your files',
    text: 'Download files individually or grab everything at once with Download all. Compressed images are ready to upload straight to your website.',
  },
];

const RELATED_TOOLS = [
  {
    slug: 'alt-text-checker',
    name: 'Alt Text Checker',
    desc: 'Find images missing alt text on any page.',
  },
  {
    slug: 'website-speed-test',
    name: 'Website Speed Test',
    desc: 'Check how fast any page loads.',
  },
  {
    slug: 'open-graph-checker',
    name: 'Open Graph Checker',
    desc: 'Preview social share tags on any URL.',
  },
  {
    slug: 'meta-title-description-checker',
    name: 'Meta Title & Description Checker',
    desc: 'Check title tag and meta description length for any page.',
  },
];

const MAX_FILE_BYTES = 30 * 1024 * 1024;

export default function ImageCompressor() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [format, setFormat] = useState<OutFormat>('image/webp');
  const [quality, setQuality] = useState(80);
  const [maxDim, setMaxDim] = useState(1920);
  const [targetKb, setTargetKb] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const busyRef = useRef(false);
  const itemsRef = useRef<ImageItem[]>([]);
  itemsRef.current = items;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke all object URLs on unmount.
  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outUrl) URL.revokeObjectURL(item.outUrl);
      }
    };
  }, []);

  // JSON-LD schema.
  useEffect(() => {
    const id = 'rankvelt-image-compressor-schema';
    document.getElementById(id)?.remove();
    const s = document.createElement('script');
    s.id = id;
    s.type = 'application/ld+json';
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Free Image Compressor',
          url: 'https://www.rankvelt.com/tools/image-compressor',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: IMAGE_COMPRESSOR_FAQS.map((f) => ({
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

  const parsedTargetKb = (() => {
    const n = parseFloat(targetKb);
    return targetKb.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null;
  })();

  const runCompression = async (
    list: ImageItem[],
    fmt: OutFormat,
    q: number,
    md: number,
    tk: number | null,
  ) => {
    if (busyRef.current || list.length === 0) return;
    busyRef.current = true;
    setBusy(true);
    setNotice(null);
    try {
      for (const item of list) {
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: 'processing' as const, error: null } : p)),
        );
        try {
          const partial = await compressOne(item, fmt, q, md, tk, (url) => {
            if (url) URL.revokeObjectURL(url);
          });
          setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, ...partial } : p)));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Compression failed.';
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'error' as const, error: message } : p)),
          );
        }
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const accepted: ImageItem[] = [];
    const rejected: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        rejected.push(file.name || 'unnamed file');
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} (over 30 MB)`);
        return;
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      accepted.push({
        id,
        file,
        name: file.name || 'image',
        originalSize: file.size,
        originalWidth: 0,
        originalHeight: 0,
        previewUrl: URL.createObjectURL(file),
        status: 'ready',
        outUrl: null,
        outSize: null,
        outWidth: null,
        outHeight: null,
        usedQuality: null,
        outName: file.name || 'image',
        error: null,
      });
    });

    if (rejected.length > 0) {
      setNotice(
        `Skipped ${rejected.length} file${rejected.length === 1 ? '' : 's'}: ${rejected.slice(0, 3).join(', ')}${rejected.length > 3 ? ', ...' : ''}. Only images up to 30 MB are accepted.`,
      );
    }

    if (accepted.length === 0) return;

    // Read original dimensions for display.
    accepted.forEach((item) => {
      createImageBitmap(item.file)
        .then((bmp) => {
          const w = bmp.width;
          const h = bmp.height;
          bmp.close();
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, originalWidth: w, originalHeight: h } : p)),
          );
        })
        .catch(() => {
          /* dimensions stay 0; compression will surface any real read error */
        });
    });

    setItems((prev) => [...prev, ...accepted]);
    if (!busyRef.current) {
      void runCompression(accepted, format, quality / 100, maxDim, parsedTargetKb);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.outUrl) URL.revokeObjectURL(target.outUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.previewUrl);
      if (item.outUrl) URL.revokeObjectURL(item.outUrl);
    }
    setItems([]);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadItem = (item: ImageItem) => {
    if (!item.outUrl) return;
    const a = document.createElement('a');
    a.href = item.outUrl;
    a.download = item.outName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === 'done' && i.outUrl);
    for (const item of done) {
      downloadItem(item);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  };

  const doneItems = items.filter((i) => i.status === 'done' && i.outSize !== null);
  const totalOriginal = items.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = doneItems.reduce((sum, i) => sum + (i.outSize ?? 0), 0);
  const totalSavedPct =
    totalOriginal > 0 && doneItems.length > 0
      ? Math.round((1 - totalCompressed / totalOriginal) * 100)
      : 0;

  const savingsFor = (item: ImageItem): number | null => {
    if (item.outSize === null || item.originalSize === 0) return null;
    return Math.round((1 - item.outSize / item.originalSize) * 100);
  };

  return (
    <main className="min-h-screen">
      {/* Tool UI card */}
      <section className="mx-auto max-w-4xl px-4 pt-12">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-6 sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
            Free SEO Tool
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Free Image Compressor
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Compress images free with this online WebP image compressor. Convert to WebP,
            shrink JPEG and PNG file sizes, resize oversized photos, and even target an exact
            size like 100KB. Everything happens in your browser with no upload and no signup.
          </p>

          {/* Dropzone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Add images to compress"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
              dragOver ? 'border-primary bg-primary/5' : 'border-white/[0.08] bg-black/40 hover:border-white/20'
            }`}
          >
            <Upload size={32} className="text-primary" />
            <p className="mt-4 font-bold text-white">
              {dragOver ? 'Drop your images here' : 'Drag and drop images here, or click to browse'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Multiple files supported. Up to 30 MB each. Your files never leave your device.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          {notice && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-4">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-white/75">{notice}</p>
            </div>
          )}

          {/* Settings */}
          <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-5">
            <p className="text-sm font-black uppercase tracking-wider text-white/60">Compression settings</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-bold text-white/75">Output format</p>
                <div className="flex gap-2">
                  {(['image/webp', 'image/jpeg', 'image/png'] as OutFormat[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                        format === f
                          ? 'border-primary bg-primary/10 text-white'
                          : 'border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {formatLabel(f)}
                    </button>
                  ))}
                </div>
                {format === 'image/png' && (
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    PNG is lossless, so the quality slider has little effect on PNG output.
                  </p>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-white/75">Quality</p>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-sm font-black text-primary">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#d4ff4f]"
                  aria-label="Compression quality"
                />
                <p className="mt-1 text-xs text-white/60">70 to 85 looks clean for most photos.</p>
              </div>
              <div>
                <label htmlFor="max-dim" className="mb-2 block text-sm font-bold text-white/75">
                  Max dimension (resize)
                </label>
                <select
                  id="max-dim"
                  value={maxDim}
                  onChange={(e) => setMaxDim(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/[0.08] bg-black/60 px-3 py-2 text-sm font-bold text-white focus:border-primary focus:outline-none"
                >
                  <option value={0}>Original size (no resize)</option>
                  <option value={800}>800 px</option>
                  <option value={1200}>1200 px</option>
                  <option value={1600}>1600 px</option>
                  <option value={1920}>1920 px</option>
                  <option value={2560}>2560 px</option>
                </select>
                <p className="mt-1 text-xs text-white/60">Resizing is the fastest way to shrink huge photos.</p>
              </div>
              <div>
                <label htmlFor="target-kb" className="mb-2 block text-sm font-bold text-white/75">
                  Target file size (optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="target-kb"
                    type="number"
                    min={1}
                    value={targetKb}
                    onChange={(e) => setTargetKb(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full rounded-lg border border-white/[0.08] bg-black/60 px-3 py-2 text-sm font-bold text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
                  />
                  <span className="shrink-0 text-sm font-bold text-white/60">KB</span>
                </div>
                <p className="mt-1 text-xs text-white/60">
                  Steps quality down until the file fits. Works with WebP and JPEG.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void runCompression(items, format, quality / 100, maxDim, parsedTargetKb)}
                disabled={busy || items.length === 0}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-40"
              >
                <RefreshCw size={16} className={busy ? 'animate-spin' : ''} />
                {busy ? 'Compressing...' : 'Compress images'}
              </button>
              <button
                type="button"
                onClick={() => void downloadAll()}
                disabled={doneItems.length === 0 || busy}
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white disabled:opacity-40"
              >
                <Download size={16} />
                Download all ({doneItems.length})
              </button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm font-bold text-white/75 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                >
                  <Trash2 size={16} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Batch totals */}
          {items.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-white/[0.08] bg-black/40 p-4 text-sm">
              <span className="font-bold text-white">
                {items.length} image{items.length === 1 ? '' : 's'}
              </span>
              <span className="text-white/60">
                Before: <span className="font-bold text-white">{formatBytes(totalOriginal)}</span>
              </span>
              {doneItems.length > 0 && (
                <>
                  <span className="text-white/60">
                    After: <span className="font-bold text-white">{formatBytes(totalCompressed)}</span>
                  </span>
                  <span
                    className={`font-black ${totalSavedPct >= 0 ? 'text-primary' : 'text-white/60'}`}
                  >
                    {totalSavedPct >= 0 ? `${totalSavedPct}% smaller` : `${Math.abs(totalSavedPct)}% larger`}
                  </span>
                </>
              )}
            </div>
          )}

          {/* File list */}
          {items.length > 0 && (
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const saved = savingsFor(item);
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/[0.08] bg-black/40 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-lg border border-white/[0.08] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate text-sm font-bold text-white" title={item.name}>
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0 rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-white/60">
                          {formatBytes(item.originalSize)}
                          {item.originalWidth > 0 && `, ${item.originalWidth} x ${item.originalHeight} px`}
                          {' to '}
                          {formatLabel(format)}
                          {item.usedQuality !== null && format !== 'image/png' && (
                            <> at {Math.round(item.usedQuality * 100)}% quality</>
                          )}
                        </p>

                        {item.status === 'processing' && (
                          <p className="mt-2 flex items-center gap-2 text-xs font-bold text-primary">
                            <RefreshCw size={14} className="animate-spin" /> Compressing...
                          </p>
                        )}

                        {item.status === 'error' && (
                          <p className="mt-2 flex items-start gap-2 text-xs font-bold text-white/75">
                            <AlertCircle size={14} className="mt-0.5 shrink-0 text-primary" />
                            {item.error ?? 'Compression failed.'}
                          </p>
                        )}

                        {item.status === 'done' && item.outSize !== null && (
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="flex items-center gap-1.5 text-xs text-white/60">
                              <CheckCircle2 size={14} className="text-primary" />
                              <span className="font-bold text-white">{formatBytes(item.outSize)}</span>
                              {item.outWidth !== null && item.outHeight !== null && (
                                <span>
                                  , {item.outWidth} x {item.outHeight} px
                                </span>
                              )}
                            </span>
                            {saved !== null && (
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-black ${saved >= 0 ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white/60'}`}
                              >
                                {saved >= 0 ? `${saved}% smaller` : `${Math.abs(saved)}% larger`}
                              </span>
                            )}
                            {saved !== null && saved < 0 && (
                              <span className="text-xs text-white/60">
                                Try a lower quality or a smaller max dimension.
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => downloadItem(item)}
                              className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-black transition hover:opacity-90"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {items.length === 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-4">
              <FileImage size={18} className="shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-white/60">
                Your compressed images will appear here with before and after sizes. Add a few
                images to see how much smaller WebP can make them.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Compress images in four quick steps
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

      <ImageCompressorArticle />

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Image compressor FAQs
        </h2>
        <div className="mt-6 space-y-3">
          {IMAGE_COMPRESSOR_FAQS.map((f, i) => (
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <ImageIcon size={24} className="text-primary" />
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
            Images fixed. What else is slowing your site down?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/75">
            Heavy images are only one speed problem. RankVelt audits your full site, technical
            SEO, content, and AI search visibility, then shows you exactly what to fix to win
            more customers.
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

function ImageCompressorArticle() {
  return (
    <>
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The basics</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          What image compression actually does
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Image compression shrinks a file by storing the same picture with less data. There
            are two families. Lossy compression, used by JPEG and WebP, throws away visual
            detail the human eye barely notices, which is why a quality slider exists: lower
            quality means more discarded detail and a much smaller file. Lossless compression,
            used by PNG, keeps every pixel perfect and instead finds smarter ways to encode the
            data, which is why PNG files are bigger and why the quality slider does little for
            them.
          </p>
          <p>
            Resizing is the other half of the story, and beginners underestimate it. A photo
            straight from a camera can be 6000 pixels wide, while the largest it will ever
            appear on your site might be 1200 pixels. Those extra pixels multiply the file size
            without adding anything a visitor can see. Shrinking dimensions before compressing
            is the single fastest way to reduce image file size, and this tool lets you cap the
            max dimension in the same pass as compression.
          </p>
          <p>
            Format choice matters as much as settings. A photo saved as PNG can easily be five
            to ten times larger than the same photo as a well-tuned WebP, with no visible
            difference. That is why converting formats, not just lowering quality, is the core
            move in image compression. The tool above re-encodes your uploads with the Canvas
            API right in your browser, so you can try WebP against JPEG and compare the real
            numbers instead of guessing.
          </p>
          <p>
            One honest caveat: compression is a one-way trip. Every time you re-compress an
            already compressed JPEG, a little more detail is lost, which is why you should
            always work from the highest-quality original you have. Compress once, at export
            or upload time, and keep the original archived. The damage from a single careful
            pass at quality 80 is invisible; the damage from five careless passes is not.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Why it matters</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Why image size matters for SEO and sales
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Images are usually the heaviest part of a web page. On many sites they account for
            more than half of all bytes transferred, which makes them the biggest lever for
            page speed. Speed matters twice: visitors on mobile connections abandon slow pages
            quickly, and search engines use page experience signals, including loading
            performance, as ranking factors. A product page that loads in two seconds instead
            of six does not just rank a little better; it converts the visitors who would
            otherwise have left.
          </p>
          <p>
            This is most visible on product pages, where high-quality photos are non-negotiable
            but file size is the silent conversion killer. Shoppers will not wait for a gallery
            of 4MB images to load, especially on phones. Smart{' '}
            <a href="/blog/high-converting-product-pages" className="text-primary underline underline-offset-2 hover:opacity-90">
              product image optimization
            </a>{' '}
            means right-sized, compressed images that still look crisp: fast enough to keep
            shoppers scrolling, sharp enough to keep them buying. Compressing before upload is
            the cheapest CRO improvement most stores have never made.
          </p>
          <p>
            There is also a crawl and cost angle that site owners forget. Search engine crawlers
            have a budget for every site; bloated pages consume more of it per URL, which can
            slow down how quickly new and updated pages get discovered. On metered hosting or
            CDNs, every extra megabyte is bandwidth you pay for, multiplied by every visitor.
            Smaller images quite literally cost less to serve.
          </p>
          <p>
            The good news is that image compression is one of the rare optimizations with no
            real tradeoff when done right. Nobody asks you to remove images or accept ugly
            ones. You keep the same visuals, the same layout, and the same content, and the
            page simply arrives faster. It belongs at the top of every site speed checklist,
            before the exotic work begins.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">WebP</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          WebP: the format your images should probably use
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            WebP is a modern image format built for the web. Compared with JPEG, it produces
            noticeably smaller files at similar visual quality for photos, and compared with
            PNG it is dramatically smaller for photographic content while still supporting
            transparency. For most websites, switching photos from JPEG or PNG to WebP is the
            highest-return single change in image compression, which is why a dedicated WebP
            converter earns its place in your toolkit.
          </p>
          <p>
            The old objection to WebP was browser support, and it no longer applies. Every
            current browser, Chrome, Safari, Firefox, and Edge, displays WebP images, covering
            effectively all of your real visitors. Content management systems and CDNs have
            caught up too: WordPress supports WebP uploads, and most image CDNs can serve WebP
            automatically. There is no longer a compatibility reason to ship bloated JPEGs to
            everyone.
          </p>
          <p>
            When should you not use WebP? Keep PNG for graphics where every pixel must stay
            perfect: logos with sharp edges, small text in images, and simple flat-color
            illustrations. PNG is lossless, so fine lines stay crisp in a way lossy formats can
            soften. For everything photographic, product shots, team photos, blog headers,
            backgrounds, WebP wins. This compressor converts to WebP with one click, so you
            can test both and let the file sizes decide.
          </p>
          <p>
            A practical tip for migration: you do not need to convert your entire media
            library in one heroic session. Start with the images on your most visited pages,
            especially above-the-fold heroes and product galleries, where the speed payoff is
            largest. Work backward through the rest over time. Each converted image is a
            permanent, compounding speed improvement.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">How to</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to reduce picture file size without ruining quality
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            If you are wondering how do I reduce a pictures file size without making it look
            terrible, work in this order: dimensions first, format second, quality third. Start
            by resizing to the largest size the image will actually display. A blog content
            image shown at 800 pixels wide does not need to be 3000 pixels wide; resizing
            alone can cut 70 percent or more of the file. Only after the dimensions are right
            should you touch quality.
          </p>
          <p>
            Next, pick the right format for the content. Photos and complex images go to WebP;
            sharp graphics stay PNG. This one decision often matters more than any quality
            number, because a photo saved as PNG is fighting the format itself. Converting a
            2MB PNG screenshot-style photo to WebP frequently lands under 200KB with no
            visible change.
          </p>
          <p>
            Finally, tune quality with your eyes, not with superstition. For WebP and JPEG,
            quality 80 is a reliable starting point for photos: files shrink enormously
            compared to quality 100 while looking identical at normal viewing sizes. Drop to 70
            if you need smaller files and the image still looks clean; push toward 90 only for
            images where fine detail truly matters, like zoomable product shots. Below 60,
            banding in skies and blockiness in shadows start to show, so treat that range as
            emergency use.
          </p>
          <p>
            Judge quality at the size visitors will see, not zoomed to 300 percent. Nobody
            experiences your hero image pixel by pixel; they see it at display size, in a
            layout, in under a second. The before and after preview in this tool shows you the
            honest result, and the per-file download means you can A/B two quality levels on
            your actual page before committing.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Target size</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          How to compress an image to a target size like 100KB
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Sometimes "smaller" is not specific enough: a marketplace, ad platform, or CMS
            demands an image under an exact limit, and the classic request is an image
            compressor to 100KB. Guessing quality levels by trial and error is tedious, so this
            tool automates it. Enter your target in KB and it encodes the image at successively
            lower quality levels, from near-lossless down, until the file fits under your
            target, then reports the quality it landed on.
          </p>
          <p>
            The reported quality level is your honesty check. If a photo reaches 100KB at
            quality 78, you have a clean file and nothing to worry about. If it only fits at
            quality 22, the tool is telling you the truth: that much detail cannot live in
            100KB without visible damage. At that point the right move is not lower quality but
            smaller dimensions, so cap the max dimension and run the target pass again.
            Shrinking a 4000px photo to 1600px often brings the needed quality back into the
            safe zone.
          </p>
          <p>
            Two limits are worth knowing. First, the target-size ladder works with WebP and
            JPEG, not PNG, because PNG is lossless and its size barely responds to quality
            settings. Second, some images have a floor: a highly detailed photo at large
            dimensions simply contains more visual information than a tiny budget allows. When
            the smallest rung of the ladder still exceeds your target, the tool shows you the
            final size plainly instead of pretending it succeeded, and the fix is almost always
            resizing, not more compression.
          </p>
          <p>
            Use target sizing strategically rather than by default. Forcing every image on your
            site to exactly 100KB is arbitrary; a simple icon and a detailed photograph have
            different needs. Reserve target mode for hard external limits, uploads, ads, email
            attachments, and use sensible quality plus resizing for everything else. Precision
            where it is required, judgment everywhere else.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">GIFs</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Can you compress a GIF online?
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            GIFs are the awkward exception in image compression. The format is ancient,
            limited to 256 colors, and wildly inefficient by modern standards, which is why
            people search for ways to compress GIFs online. The catch is animation: most
            browser-based compressors, including this one, work frame by frame through the
            Canvas API, and Canvas hands back a single still image. Upload an animated GIF
            here and you will get a perfectly good still WebP of its first frame, which is
            useful if a still is what you wanted, and a nasty surprise if it is not.
          </p>
          <p>
            If the animation matters, the modern answer is animated WebP or a short muted
            video, both far smaller than an equivalent GIF. Converting animation requires
            dedicated software or a specialized encoder rather than a general image
            compressor, because the tool must re-encode timing and frame differences, not just
            pixels. For reaction GIFs and memes, uploading the clip as a looping muted video
            is usually the smallest option of all.
          </p>
          <p>
            For still GIFs, logos, icons, and simple graphics saved as GIF out of habit, the
            advice is simple: convert them. A still GIF converted to WebP or PNG is almost
            always smaller, often dramatically so, with identical appearance. There is no
            reason to keep serving a 1990s format for static images in 2026.
          </p>
          <p>
            Bottom line: use this tool freely for still images of any format, including still
            GIFs, and treat animated GIFs as a separate job for specialized software. Knowing
            which job you have saves you from the classic disappointment of a beautifully
            compressed file that no longer moves.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Mistakes</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Common image compression mistakes
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            The most expensive mistake is uploading the original camera file and letting the
            CMS deal with it. Most platforms do generate smaller versions, but the original
            often remains reachable, and themes sometimes serve the full-size file by
            accident. Compress and resize before upload, so the correct file is the only file.
          </p>
          <p>
            The second mistake is compressing the wrong format: running quality 60 on a PNG
            photo and wondering why the file barely shrank. PNG ignores quality because it is
            lossless; the fix is converting to WebP, not pushing the slider. Conversely,
            saving a logo with fine text as a low-quality JPEG produces fuzzy edges that no
            setting fully repairs. Match the format to the content first, then tune.
          </p>
          <p>
            Third is double compression: downloading an already-compressed image from your own
            site and compressing it again for a new use. Each lossy pass discards more detail,
            so always go back to the highest-quality original. Keep an organized originals
            folder; future you will be grateful.
          </p>
          <p>
            The fourth mistake is forgetting everything around the file. A compressed image
            with a name like IMG_4829.jpg and no alt text is a half-finished job. Descriptive
            filenames help a little with{' '}
            <a href="/blog/optimize-google-ai-overviews" className="text-primary underline underline-offset-2 hover:opacity-90">
              image SEO
            </a>
            , and good alt text helps both accessibility and search visibility. Compression gets
            the image onto the page fast; naming and alt text make it work once it arrives.
            Pair this tool with an alt text audit and the job is actually done.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Workflow</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          A simple workflow for every image you upload
        </h2>
        <div className="mt-5 space-y-5 text-base leading-relaxed text-white/75">
          <p>
            Make compression a habit, not a project. The workflow that works: export or
            download the highest-quality original, decide the display size, and compress here
            with WebP, a capped max dimension, and quality around 80. Download the result,
            give it a descriptive filename with hyphens instead of spaces, and upload that
            file, not the original.
          </p>
          <p>
            Then finish the metadata. Write alt text that describes what the image shows for
            someone who cannot see it, naturally including the relevant keyword when it fits.
            Add a caption where it helps readers, and check that the surrounding text gives
            search engines context about the image subject. These steps take a minute and
            compound across every image on the site.
          </p>
          <p>
            Finally, verify with measurement. Run a speed test on the page before and after
            your image pass and watch the image weight drop; the improvement is usually
            immediate and visible in the numbers. Recheck quarterly or whenever you publish
            image-heavy content, because new uploads are where old habits creep back in.
          </p>
          <p>
            Teams should write this workflow down, not keep it in one person's head. A short
            checklist, max dimensions per template, WebP by default, quality 80, descriptive
            filenames, alt text always, prevents the slow accumulation of 3MB hero images that
            quietly drags a site down over a year. Compression tools are cheap; discipline is
            the actual technology.
          </p>
        </div>
      </section>
    </>
  );
}
