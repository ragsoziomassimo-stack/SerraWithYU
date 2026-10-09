import { useRef, useState } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Camera, Upload, X, Image as ImageIcon, ZoomIn, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import SectionCard from "./SectionCard.tsx";
import { motion, AnimatePresence } from "motion/react";
import { compressImage } from "@/lib/image-compression.ts";
import { useProgrammerSpace, getStoredProgrammerPassword } from "@/hooks/use-programmer-space.ts";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

type MediaItem = {
  _id: Id<"turista_media">;
  url: string | null;
  contentType: string;
  authorName: string;
  caption?: string;
  expiresAt: string;
};

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/80 z-10"
        >
          <X size={22} />
        </button>
        <motion.div
          className="max-w-full max-h-full flex flex-col items-center px-4"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.85 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
              src={item.url ?? undefined}
              alt={item.caption ?? item.authorName}
              className="max-w-[95vw] max-h-[80vh] rounded-xl object-contain"
            />
          <div className="mt-3 text-center">
            <p className="text-white font-semibold text-sm">{item.authorName}</p>
            {item.caption && <p className="text-white/70 text-xs mt-1">{item.caption}</p>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MediaGrid({ programmerUnlocked }: { programmerUnlocked: boolean }) {
  const { t } = useTranslation("turista");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const deleteMedia = useMutation(api.turista.deleteMedia);
  const [deletingId, setDeletingId] = useState<Id<"turista_media"> | null>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.turista.listMedia,
    {},
    { initialNumItems: 12 }
  );

  const handleDelete = async (id: Id<"turista_media">) => {
    setDeletingId(id);
    try {
      const password = getStoredProgrammerPassword();
      await deleteMedia({ mediaId: id, password });
      toast.success(t("deleted"));
    } catch (err) {
      if (err instanceof ConvexError) {
        const { message } = err.data as { message: string };
        toast.error(message);
      } else {
        toast.error(t("errorDelete"));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "LoadingFirstPage") {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
        <Camera size={40} className="opacity-40" />
        <p className="text-sm font-medium">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
      <div className="grid grid-cols-2 gap-3">
        {results.map((item) => (
          <div
            key={item._id}
            className="relative rounded-xl overflow-hidden bg-black/5 border border-[#e8c9a0] cursor-pointer group"
            onClick={() => setLightboxItem(item)}
          >
            <img
                src={item.url ?? undefined}
                alt={item.caption ?? item.authorName}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            {/* Zoom hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            {/* Author badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
              <p className="text-white text-[11px] font-semibold truncate">{item.authorName}</p>
              {item.caption && (
                <p className="text-white/80 text-[10px] truncate">{item.caption}</p>
              )}
            </div>
            {/* Delete button — visibile solo con lo Spazio del Programmatore sbloccato */}
            {programmerUnlocked && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete(item._id);
                }}
                disabled={deletingId === item._id}
                className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1.5 cursor-pointer hover:bg-red-700 disabled:opacity-50 z-10"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {status === "CanLoadMore" && (
        <div className="flex justify-center mt-4">
          <Button variant="secondary" size="sm" onClick={() => loadMore(12)}>
            {t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}

function UploadForm() {
  const { t } = useTranslation("turista");
  const generateUploadUrl = useMutation(api.turista.generateUploadUrl);
  const saveMedia = useMutation(api.turista.saveMedia);

  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState(() => {
    return typeof window !== "undefined" ? (localStorage.getItem("turista_name") ?? "Anonimo") : "Anonimo";
  });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("fileTooLarge"));
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      toast.error(t("uploadError"));
      return;
    }
    setUploading(true);
    try {
      const fileToUpload = await compressImage(selectedFile);
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": fileToUpload.type },
        body: fileToUpload,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json() as { storageId: Id<"_storage"> };
      // Save name for next time
      localStorage.setItem("turista_name", authorName.trim());
      await saveMedia({
        storageId,
        contentType: fileToUpload.type,
        authorName: authorName.trim(),
        caption: caption.trim() || undefined,
      });
      toast.success(t("uploadSuccess"));
      clearFile();
      setCaption("");
    } catch (err) {
      if (err instanceof ConvexError) {
        const { message } = err.data as { message: string };
        toast.error(message);
      } else {
        toast.error(t("uploadError"));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#fff8f0] rounded-xl border border-[#e8c9a0] p-4 mb-4">
      <p className="text-sm font-bold text-[#8B2500] mb-3">{t("uploadTitle")}</p>

      {/* Preview */}
      {preview && selectedFile ? (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-[#e8c9a0] bg-black/5">
          <img src={preview} alt="preview" className="w-full max-h-52 object-contain" />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-[#e8c9a0] rounded-xl text-[#8B2500]/60 hover:border-[#8B2500] hover:text-[#8B2500] transition-colors cursor-pointer mb-3"
        >
          <ImageIcon size={22} />
          <span className="text-xs font-medium">{t("chooseFile")}</span>
        </button>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Caption */}
      {selectedFile && (
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("captionPlaceholder")}
          className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30"
          maxLength={120}
        />
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-[#8B2500] hover:bg-[#6d1d00] text-white"
        size="sm"
      >
        {uploading ? (
          <span className="flex items-center gap-2"><Upload size={14} className="animate-bounce" />{t("uploading")}</span>
        ) : (
          <span className="flex items-center gap-2"><Upload size={14} />{t("publishBtn")}</span>
        )}
      </Button>
    </div>
  );
}

export default function SectionTurista() {
  const { t } = useTranslation("turista");
  const { unlocked: programmerUnlocked } = useProgrammerSpace();

  return (
    <SectionCard title={t("h_card")} emoji="📸">
      <p className="text-sm text-[#555] mb-4">{t("intro")}</p>
      <UploadForm />
      <MediaGrid programmerUnlocked={programmerUnlocked} />
    </SectionCard>
  );
}
