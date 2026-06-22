/**
 * Screenshot storage. In local mode, images live in IndexedDB keyed by id
 * (heavy data kept out of localStorage). When Supabase is configured, the
 * same ids become object paths in Supabase Storage. Callers don't care which.
 */

import { isSupabaseEnabled } from "@/lib/supabase/client";
import { sbPutImage, sbGetImage, sbDeleteImage, sbClearImages } from "@/lib/supabase/backend";

const DB_NAME = "tradeedge-images";
const STORE = "images";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(id: string, dataUrl: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(dataUrl, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(id: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as string) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbClear(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function putImage(id: string, dataUrl: string): Promise<void> {
  return isSupabaseEnabled ? sbPutImage(id, dataUrl) : idbPut(id, dataUrl);
}

export async function getImage(id: string): Promise<string | null> {
  return isSupabaseEnabled ? sbGetImage(id) : idbGet(id);
}

export async function deleteImage(id: string): Promise<void> {
  return isSupabaseEnabled ? sbDeleteImage(id) : idbDelete(id);
}

export async function clearImages(): Promise<void> {
  return isSupabaseEnabled ? sbClearImages() : idbClear();
}

/** Compress a File / pasted blob into a reasonably sized JPEG data URL. */
export function fileToDataUrl(file: File | Blob, maxSize = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}
