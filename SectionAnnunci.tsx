import { useRef, useState } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Upload, X, Image as ImageIcon, ZoomIn, Trash2, Phone, Tag, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import SectionCard from "./SectionCard.tsx";
import { motion, AnimatePresence } from "motion/react";
import { compressImage } from "@/lib/image-compression.ts";
import { useProgrammerSpace, getStoredProgrammerPassword } from "@/hooks/use-programmer-space.ts";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function getOwnerKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem("annunci_owner_key");
  if (!key) {
    key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("annunci_owner_key", key);
  }
  return key;
}

type Annuncio = {
  _id: Id<"annunci">;
  url: string | null;
  titolo: string;
  descrizione: string;
  prezzo?: string;
  contatto: string;
  ownerKey: string;
  expiresAt: string;
};

function Lightbox({ item, onClose }: { item: Annuncio; onClose: () => void }) {
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
            alt={item.titolo}
            className="max-w-[95vw] max-h-[80vh] rounded-xl object-contain"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AnnuncioCard({ item }: { item: Annuncio }) {
  const { t } = useTranslation("annunci");
  const [lightbox, setLightbox] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const removeAnnuncio = useMutation(api.annunci.remove);
  const { unlocked: programmerUnlocked } = useProgrammerSpace();
  const isOwner = item.ownerKey === getOwnerKey();
  const canDelete = isOwner || programmerUnlocked;

  const handleDelete = async () => {
    try {
      await removeAnnuncio({
        annuncioId: item._id,
        ownerKey: getOwnerKey(),
        programmerPassword: programmerUnlocked ? getStoredProgrammerPassword() : undefined,
      });
      toast.success(t("deleted"));
    } catch (err) {
      if (err instanceof ConvexError) {
        const { message } = err.data as { message: string };
        toast.error(message);
      } else {
        toast.error(t("errorDelete"));
      }
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <>
      {lightbox && item.url && <Lightbox item={item} onClose={() => setLightbox(false)} />}
      <div className="bg-white/90 rounded-2xl shadow-sm border border-[#e8c9a0] overflow-hidden flex flex-col">
        {item.url ? (
          <div
            className="relative cursor-pointer group"
            onClick={() => setLightbox(true)}
          >
            <img src={item.url} alt={item.titolo} className="w-full h-40 object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </div>
        ) : (
          <div className="w-full h-24 bg-[#fff8f0] flex items-center justify-center">
            <ImageIcon size={28} className="text-[#8B2500]/30" />
          </div>
        )}
        <div className="p-3 flex flex-col gap-1.5 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-[#8B2500] text-sm leading-tight">{item.titolo}</h3>
            {canDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-red-500/70 hover:text-red-600 cursor-pointer flex-shrink-0"
                title={t("deleteBtn")}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
          {item.prezzo && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8B2500] bg-[#8B2500]/10 rounded-full px-2 py-0.5 w-fit">
              <Tag size={11} /> {item.prezzo}
            </span>
          )}
          <p className="text-xs text-[#444] leading-relaxed line-clamp-4">{item.descrizione}</p>
          <div className="flex items-center gap-1 text-xs text-[#8B2500] font-semibold mt-auto pt-1">
            <Phone size={12} /> {item.contatto}
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDeleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t("deleteBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AnnunciGrid() {
  const { t } = useTranslation("annunci");

  const { results, status, loadMore } = usePaginatedQuery(
    api.annunci.list,
    {},
    { initialNumItems: 12 }
  );

  if (status === "LoadingFirstPage") {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
        <Tag size={40} className="opacity-40" />
        <p className="text-sm font-medium">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        {results.map((item) => (
          <AnnuncioCard key={item._id} item={item} />
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
  const { t } = useTranslation("annunci");
  const generateUploadUrl = useMutation(api.annunci.generateUploadUrl);
  const createAnnuncio = useMutation(api.annunci.create);

  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [contatto, setContatto] = useState(() => {
    return typeof window !== "undefined" ? (localStorage.getItem("annunci_contatto") ?? "") : "";
  });
  const [uploading, setUploading] = useState(false);

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

  const resetForm = () => {
    setTitolo("");
    setDescrizione("");
    setPrezzo("");
    clearFile();
  };

  const handlePublish = async () => {
    if (!titolo.trim() || !descrizione.trim() || !contatto.trim()) {
      toast.error(t("requiredFields"));
      return;
    }
    setUploading(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      let contentType: string | undefined;

      if (selectedFile) {
        const fileToUpload = await compressImage(selectedFile);
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": fileToUpload.type },
          body: fileToUpload,
        });
        if (!res.ok) throw new Error("Upload failed");
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        storageId = json.storageId;
        contentType = fileToUpload.type;
      }

      localStorage.setItem("annunci_contatto", contatto.trim());

      await createAnnuncio({
        titolo: titolo.trim(),
        descrizione: descrizione.trim(),
        prezzo: prezzo.trim() || undefined,
        contatto: contatto.trim(),
        storageId,
        contentType,
        ownerKey: getOwnerKey(),
      });

      toast.success(t("uploadSuccess"));
      resetForm();
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

      {/* Foto */}
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
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-[#e8c9a0] rounded-xl text-[#8B2500]/60 hover:border-[#8B2500] hover:text-[#8B2500] transition-colors cursor-pointer mb-3"
        >
          <ImageIcon size={20} />
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

      <input
        type="text"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        placeholder={t("titlePlaceholder")}
        className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30"
        maxLength={100}
      />
      <textarea
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        placeholder={t("descPlaceholder")}
        className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30 resize-none"
        rows={3}
        maxLength={1000}
      />
      <input
        type="text"
        value={prezzo}
        onChange={(e) => setPrezzo(e.target.value)}
        placeholder={t("pricePlaceholder")}
        className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30"
        maxLength={40}
      />
      <input
        type="text"
        value={contatto}
        onChange={(e) => setContatto(e.target.value)}
        placeholder={t("contactPlaceholder")}
        className="w-full text-sm border border-[#e8c9a0] rounded-lg px-3 py-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2500]/30"
        maxLength={100}
      />

      <Button
        onClick={handlePublish}
        disabled={uploading}
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

const USPACC_LOGO = "https://hercules-cdn.com/file_00Kkv9wSdQNeEtVo00Pn2PSJ";

export default function SectionAnnunci() {
  const { t } = useTranslation("annunci");

  return (
    <SectionCard title={t("h_card")} emoji="🛍️" headerImage={USPACC_LOGO}>
      <p className="text-sm text-[#555] mb-4">{t("intro")}</p>
      <Authenticated>
        <UploadForm />
      </Authenticated>
      <Unauthenticated>
        <div className="bg-[#fff8f0] rounded-xl border border-[#e8c9a0] p-4 mb-4 flex flex-col items-center gap-3 text-center">
          <LogIn size={24} className="text-[#8B2500]/60" />
          <p className="text-sm text-[#8B2500] font-semibold">{t("loginRequired")}</p>
          <SignInButton
            signInText={t("loginBtn")}
            className="bg-[#8B2500] hover:bg-[#6d1d00] text-white"
            size="sm"
          />
        </div>
      </Unauthenticated>
      <AnnunciGrid />
    </SectionCard>
  );
}
