import { useRef, useState, useEffect } from "react";
import { useMutation, usePaginatedQuery, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Upload, X, FileText, Image as ImageIcon, ZoomIn, Newspaper, RefreshCw, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import SectionCard from "./SectionCard.tsx";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { compressImage } from "@/lib/image-compression.ts";
import { useProgrammerSpace, getStoredProgrammerPassword } from "@/hooks/use-programmer-space.ts";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

type MediaItem = {
  _id: Id<"politica_media">;
  url: string | null;
  contentType: string;
  authorName: string;
  caption?: string;
  expiresAt: string;
};

type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: string;
};

// ─── LIGHTBOX ──────────────────────────────────────────────────────────────

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

// ─── MEDIA GRID ─────────────────────────────────────────────────────────────

function MediaGrid({ programmerUnlocked }: { programmerUnlocked: boolean }) {
  const { t } = useTranslation("politica");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const deleteMedia = useMutation(api.politica.deleteMedia);
  const [deletingId, setDeletingId] = useState<Id<"politica_media"> | null>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.politica.listMedia,
    {},
    { initialNumItems: 12 }
  );

  const handleDelete = async (id: Id<"politica_media">) => {
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
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
        <ImageIcon size={36} className="opacity-40" />
        <p className="text-sm font-medium">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
      <div className="grid grid-cols-2 gap-3">
        {results.map((item) => {
          const isImage = item.contentType.startsWith("image/");
          return (
            <div
              key={item._id}
              className="relative rounded-xl overflow-hidden bg-black/5 border border-[#e8c9a0] cursor-pointer group"
              onClick={() => isImage ? setLightboxItem(item) : window.open(item.url ?? "#", "_blank")}
            >
              {isImage ? (
                <>
                  <img
                    src={item.url ?? undefined}
                    alt={item.caption ?? item.authorName}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn size={26} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center gap-2 bg-[#fff8f0]">
                  <FileText size={36} className="text-[#8B2500]/60" />
                  <ExternalLink size={14} className="text-[#8B2500]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
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
          );
        })}
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

// ─── UPLOAD FORM ─────────────────────────────────────────────────────────────

function UploadForm() {
  const { t } = useTranslation("politica");
  const generateUploadUrl = useMutation(api.politica.generateUploadUrl);
  const saveMedia = useMutation(api.politica.saveMedia);

  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState(() => {
    return typeof window !== "undefined" ? (localStorage.getItem("politica_name") ?? "Anonimo") : "Anonimo";
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
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
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
      localStorage.setItem("politica_name", authorName.trim());
      await saveMedia({
        storageId,
        contentType: fileToUpload.type,
        authorName: authorName.trim() || "Anonimo",
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

      {/* Nome autore */}
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Il tuo nome"
        className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30"
        maxLength={60}
      />

      {/* File picker */}
      {preview ? (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-[#e8c9a0] bg-black/5">
          <img src={preview} alt="preview" className="w-full max-h-48 object-contain" />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : selectedFile ? (
        <div className="relative mb-3 rounded-xl border border-[#e8c9a0] bg-[#fff8f0] flex items-center gap-3 px-4 py-3">
          <FileText size={24} className="text-[#8B2500]/60 flex-shrink-0" />
          <span className="text-xs text-[#8B2500] font-medium truncate flex-1">{selectedFile.name}</span>
          <button
            type="button"
            onClick={clearFile}
            className="bg-black/60 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-[#e8c9a0] rounded-xl text-[#8B2500]/60 hover:border-[#8B2500] hover:text-[#8B2500] transition-colors cursor-pointer mb-3"
        >
          <Upload size={20} />
          <span className="text-xs font-medium">{t("chooseFile")}</span>
        </button>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

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
      <p className="text-[10px] text-muted-foreground text-center mt-2">{t("expireNote")}</p>
    </div>
  );
}

// ─── NEWS FOGGIA ─────────────────────────────────────────────────────────────

function NewsFoggia() {
  const { t } = useTranslation("politica");
  const news = useQuery(api.politica.getNews, {});
  const refreshNews = useAction(api.politica.refreshNews);
  const [refreshing, setRefreshing] = useState(false);

  // Trigger a refresh on first mount
  useEffect(() => {
    refreshNews().catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshNews();
      toast.success(t("newsRefresh"));
    } catch {
      // silent
    } finally {
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  return (
    <div className="mt-4">
      {/* Header notizie */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-[#8B2500]" />
          <span className="text-sm font-bold text-[#8B2500]">{t("newsTitle")}</span>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 text-xs text-[#8B2500]/70 hover:text-[#8B2500] cursor-pointer transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          {t("newsRefresh")}
        </button>
      </div>

      {news === undefined ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="bg-[#fff8f0] rounded-xl border border-[#e8c9a0] p-5 text-center">
          <Newspaper size={28} className="mx-auto mb-2 text-[#8B2500]/40" />
          <p className="text-sm text-muted-foreground">{t("newsEmpty")}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{t("newsRetry")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(news as NewsArticle[]).map((article, i) => (
            <motion.a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" as const }}
              className="block bg-white rounded-xl border border-[#e8c9a0] p-3 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#8B2500] leading-snug group-hover:underline line-clamp-2 flex-1">
                  {article.title}
                </h3>
                <ExternalLink size={14} className="text-[#8B2500]/40 flex-shrink-0 mt-0.5" />
              </div>
              {article.description && (
                <p className="text-xs text-[#555] mt-1 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-muted-foreground font-medium">{article.source}</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(article.publishedAt), "dd/MM/yyyy HH:mm")}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN SECTION ────────────────────────────────────────────────────────────

export default function SectionPolitica() {
  const { t } = useTranslation("politica");
  const { unlocked: programmerUnlocked } = useProgrammerSpace();

  return (
    <SectionCard title={t("h_card")} emoji="🏛️">
      <p className="text-sm text-[#555] mb-4">{t("intro")}</p>

      {/* Bacheca upload — IN PRIMO PIANO */}
      <UploadForm />

      {/* Media pubblicati */}
      <MediaGrid programmerUnlocked={programmerUnlocked} />

      {/* Separatore */}
      <div className="border-t border-[#e8c9a0] my-4" />

      {/* Notizie Foggia */}
      <NewsFoggia />
    </SectionCard>
  );
}
