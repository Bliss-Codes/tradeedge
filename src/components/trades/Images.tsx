"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteImage, fileToDataUrl, getImage, putImage } from "@/lib/data/images";
import { uid } from "@/stores/useApp";

export function useImageUrl(id: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!id) {
      setUrl(null);
      return;
    }
    getImage(id).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [id]);
  return url;
}

export function Lightbox({ ids, index, onClose }: { ids: string[]; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const url = useImageUrl(ids[i] ?? null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, ids.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ids.length, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Trade screenshot" className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
      ) : (
        <div className="text-sm text-mute">Loading image…</div>
      )}
      {ids.length > 1 && (
        <div className="absolute bottom-6 flex items-center gap-3 rounded-full border border-edge bg-card/90 px-4 py-2 text-sm text-sub" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setI((v) => Math.max(v - 1, 0))} className="hover:text-ink" aria-label="Previous">←</button>
          <span className="font-mono text-xs">{i + 1} / {ids.length}</span>
          <button onClick={() => setI((v) => Math.min(v + 1, ids.length - 1))} className="hover:text-ink" aria-label="Next">→</button>
        </div>
      )}
      <button className="absolute right-5 top-5 rounded-full border border-edge bg-card/90 px-3 py-1.5 text-sm text-sub hover:text-ink" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export function ImageThumb({ id, onOpen, onDelete }: { id: string; onOpen: () => void; onDelete?: () => void }) {
  const url = useImageUrl(id);
  return (
    <div className="group relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-edge bg-surface">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Screenshot" className="h-full w-full cursor-zoom-in object-cover" onClick={onOpen} />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-mute">…</div>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute right-1.5 top-1.5 hidden rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-neg group-hover:block"
          aria-label="Delete image"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function ImageUploader({
  label,
  ids,
  onChange,
}: {
  label: string;
  ids: string[];
  onChange: (ids: string[]) => void;
}) {
  const [drag, setDrag] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const addFiles = useCallback(
    async (files: (File | Blob)[]) => {
      setBusy(true);
      const newIds: string[] = [];
      for (const f of files) {
        try {
          const dataUrl = await fileToDataUrl(f);
          const id = uid();
          await putImage(id, dataUrl);
          newIds.push(id);
        } catch {
          // skip unreadable files
        }
      }
      setBusy(false);
      if (newIds.length) onChange([...ids, ...newIds]);
    },
    [ids, onChange]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = Array.from(e.clipboardData.items)
        .filter((i) => i.type.startsWith("image/"))
        .map((i) => i.getAsFile())
        .filter((f): f is File => !!f);
      if (files.length) {
        e.preventDefault();
        void addFiles(files);
      }
    },
    [addFiles]
  );

  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-mute">{label}</div>
      <div
        tabIndex={0}
        onPaste={onPaste}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void addFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
        }}
        className={`rounded-xl border border-dashed p-3 transition-colors focus:outline-none focus:ring-1 focus:ring-accent/40 ${
          drag ? "border-accent bg-accent/5" : "border-edge bg-surface/50"
        }`}
      >
        <div className="flex flex-wrap gap-3">
          {ids.map((id, i) => (
            <ImageThumb
              key={id}
              id={id}
              onOpen={() => setLightbox(i)}
              onDelete={() => {
                void deleteImage(id);
                onChange(ids.filter((x) => x !== id));
              }}
            />
          ))}
          <label className="flex h-24 w-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-edge text-xs text-mute transition-colors hover:border-accent/50 hover:text-sub">
            <span className="text-lg">+</span>
            <span>{busy ? "Adding…" : "Add image"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) void addFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-[11px] text-mute">Drag & drop, paste from clipboard (click here first), or browse.</p>
      </div>
      {lightbox !== null && <Lightbox ids={ids} index={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}
