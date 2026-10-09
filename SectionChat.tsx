import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { ConvexError } from "convex/values";
import { Send, ImageIcon, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { compressImage } from "@/lib/image-compression.ts";
import { useProgrammerSpace, getStoredProgrammerPassword } from "@/hooks/use-programmer-space.ts";
import ProgrammerSpaceFooter from "./ProgrammerSpaceFooter.tsx";

const NICKNAME_KEY = "serra_chat_nickname";

// ---- Schermata scelta nickname ----
function NicknameGate({ onSet }: { onSet: (n: string) => void }) {
  const { t } = useTranslation("chat");
  const [val, setVal] = useState("");
  const submit = () => {
    const trimmed = val.trim();
    if (!trimmed) { toast.error(t("nameRequired")); return; }
    localStorage.setItem(NICKNAME_KEY, trimmed);
    onSet(trimmed);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-10">
      <div className="text-5xl">💬</div>
      <h2 className="text-xl font-black text-[#8B2500] text-center">{t("welcomeTitle")}</h2>
      <p className="text-sm text-gray-500 text-center">{t("welcomeDesc")}</p>
      <input
        className="w-full max-w-xs border-2 border-[#e8c9a0] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#8B2500] bg-white"
        placeholder={t("namePlaceholder")}
        maxLength={30}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        autoFocus
      />
      <button
        onClick={submit}
        className="bg-[#8B2500] text-white font-bold rounded-xl px-8 py-3 text-base cursor-pointer hover:bg-[#6e1d00] transition-colors"
      >
        {t("enterChat")}
      </button>
    </div>
  );
}

// ---- Bolla messaggio ----
type Msg = {
  _id: Id<"chat_messages">;
  _creationTime: number;
  nickname: string;
  text?: string;
  imageUrl?: string;
  expiresAt: string;
};

function MessageBubble({ msg, isMe, programmerUnlocked, onDelete, deleting }: { msg: Msg; isMe: boolean; programmerUnlocked: boolean; onDelete: (id: Id<"chat_messages">) => void; deleting: boolean }) {
  const time = new Date(msg._creationTime).toLocaleTimeString("it-IT", {
    hour: "2-digit", minute: "2-digit",
  });
  return (
    <div className={`flex flex-col mb-2 ${isMe ? "items-end" : "items-start"}`}>
      {!isMe && (
        <span className="text-[10px] text-[#8B2500] font-bold ml-2 mb-0.5">{msg.nickname}</span>
      )}
      <div className={`relative max-w-[75vw] rounded-2xl px-3 py-2 shadow-sm ${
        isMe
          ? "bg-[#dcf8c6] rounded-br-sm text-[#111]"
          : "bg-white rounded-bl-sm text-[#111] border border-gray-100"
      }`}>
        {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
        {msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="foto"
            className="max-w-[220px] rounded-xl object-cover cursor-pointer"
            onClick={() => window.open(msg.imageUrl, "_blank")}
          />
        )}
        <span className="text-[10px] text-gray-400 float-right mt-1 ml-2">{time}</span>
        {/* Elimina — visibile solo con lo Spazio del Programmatore sbloccato */}
        {programmerUnlocked && (
          <button
            type="button"
            onClick={() => onDelete(msg._id)}
            disabled={deleting}
            className="absolute -top-2 -right-2 bg-red-600/90 text-white rounded-full p-1 cursor-pointer hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Componente principale ----
export default function SectionChat() {
  const { t } = useTranslation("chat");
  const [nickname, setNickname] = useState<string>(() => localStorage.getItem(NICKNAME_KEY) ?? "");
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ file: File; url: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const messages = useQuery(api.chat.list, nickname ? {} : "skip") ?? [];
  const sendText = useMutation(api.chat.sendText);
  const sendImage = useMutation(api.chat.sendImage);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  const deleteMessageMutation = useMutation(api.chat.deleteMessage);
  const { unlocked: programmerUnlocked } = useProgrammerSpace();
  const [deletingId, setDeletingId] = useState<Id<"chat_messages"> | null>(null);

  // Scroll in fondo a ogni nuovo messaggio
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!nickname) {
    return <NicknameGate onSet={setNickname} />;
  }

  const handleDeleteMessage = async (messageId: Id<"chat_messages">) => {
    setDeletingId(messageId);
    try {
      const password = getStoredProgrammerPassword();
      await deleteMessageMutation({ messageId, password });
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

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !imagePreview) return;

    try {
      if (imagePreview) {
        setUploading(true);
        const fileToUpload = await compressImage(imagePreview.file);
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": fileToUpload.type },
          body: fileToUpload,
        });
        if (!res.ok) throw new Error(t("uploadError"));
        const { storageId } = await res.json() as { storageId: Id<"_storage"> };
        await sendImage({ nickname, storageId, contentType: fileToUpload.type });
        setImagePreview(null);
      }
      if (trimmed) {
        await sendText({ nickname, text: trimmed });
        setText("");
      }
    } catch {
      toast.error(t("sendError"));
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error(t("onlyImages")); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error(t("imageTooLarge")); return; }
    const url = URL.createObjectURL(file);
    setImagePreview({ file, url });
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header chat */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#8B2500] text-white shadow-md flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">💬</div>
        <div>
          <p className="font-bold text-sm leading-tight">{t("headerTitle")}</p>
          <p className="text-[10px] text-white/70">{t("headerSubtitle")}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-white/80 bg-white/20 rounded-full px-2 py-0.5">{t("greeting", { name: nickname })}</span>
          <button
            className="text-white/60 hover:text-white text-xs cursor-pointer"
            onClick={() => { localStorage.removeItem(NICKNAME_KEY); setNickname(""); }}
            title={t("changeName")}
          >
            ✏️
          </button>
        </div>
      </div>

      {/* Messaggi */}
      <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#ece5dd]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b9a8' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
            <span className="text-4xl">🌊</span>
            <p className="text-sm text-gray-600">{t("emptyTitle")}<br />{t("emptySubtitle")}</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            msg={msg}
            isMe={msg.nickname === nickname}
            programmerUnlocked={programmerUnlocked}
            onDelete={handleDeleteMessage}
            deleting={deletingId === msg._id}
          />
        ))}
        <div ref={bottomRef} />
        <ProgrammerSpaceFooter />
      </div>

      {/* Anteprima immagine selezionata */}
      {imagePreview && (
        <div className="relative flex-shrink-0 px-3 pt-2 bg-white border-t border-gray-200">
          <img src={imagePreview.url} alt="preview" className="h-20 rounded-xl object-cover" />
          <button
            className="absolute top-1 right-2 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"
            onClick={() => setImagePreview(null)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 px-3 py-2 bg-[#f0f0f0] border-t border-gray-200 flex-shrink-0">
        <button
          className="text-[#8B2500] p-2 cursor-pointer hover:opacity-70"
          onClick={() => fileRef.current?.click()}
          title={t("sendPhoto")}
        >
          <ImageIcon size={22} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <textarea
          className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#8B2500] max-h-28 min-h-[40px]"
          placeholder={t("messagePlaceholder")}
          value={text}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
        />
        <button
          onClick={() => { void handleSend(); }}
          disabled={uploading || (!text.trim() && !imagePreview)}
          className="bg-[#8B2500] text-white rounded-full p-2.5 cursor-pointer hover:bg-[#6e1d00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {uploading ? (
            <span className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
