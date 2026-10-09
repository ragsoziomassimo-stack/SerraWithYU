// Comprime le immagini lato client prima dell'upload, così occupano meno
// spazio di archiviazione e si caricano più velocemente. Ridimensiona al
// lato massimo indicato e ricodifica in JPEG con la qualità indicata.
// I file che non sono immagini (PDF, documenti, ecc.) vengono restituiti invariati.

const MAX_DIMENSION = 1600; // lato massimo in pixel
const JPEG_QUALITY = 0.8;
// Sotto questa soglia non vale la pena comprimere: il file è già leggero
const MIN_SIZE_TO_COMPRESS = 300 * 1024; // 300 KB

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossibile leggere l'immagine"));
    };
    img.src = url;
  });
}

/**
 * Comprime un file immagine ridimensionandolo e ricodificandolo in JPEG.
 * Se il file non è un'immagine, è già piccolo, o la compressione fallisce
 * per qualsiasi motivo, restituisce il file originale così l'upload non si blocca.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Le GIF animate perderebbero l'animazione se ridisegnate su canvas
  if (file.type === "image/gif") return file;
  if (file.size <= MIN_SIZE_TO_COMPRESS) return file;

  try {
    const img = await loadImage(file);
    let { width, height } = img;

    if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
      // Dimensioni già contenute: prova solo a ricomprimere la qualità
    } else if (width > height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return file;
    // Mantieni il file originale se, per qualche motivo, la versione
    // compressa risultasse più grande (es. immagine già molto compressa)
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
