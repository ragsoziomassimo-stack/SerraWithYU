import { useCallback, useMemo, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";

const SECRET_KEY = "push-subscription-secret";

export type PushStatus =
  | "unsupported"
  | "iframe"
  | "denied"
  | "loading"
  | "subscribed"
  | "unsubscribed";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function readSecret(): string | null {
  try {
    return localStorage.getItem(SECRET_KEY);
  } catch {
    return null;
  }
}

export function usePushNotifications() {
  const [secret, setSecret] = useState<string | null>(readSecret);
  const [permission, setPermission] = useState<NotificationPermission | null>(() =>
    "Notification" in window ? Notification.permission : null,
  );
  const [loading, setLoading] = useState(false);
  const getKey = useAction(api.pushNotifications.getVapidPublicKey);
  const register = useAction(api.pushNotifications.subscribe);
  const remove = useAction(api.pushNotifications.unsubscribe);

  const status: PushStatus = useMemo(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return "unsupported";
    }
    if (isInIframe()) return "iframe";
    if (permission === "denied") return "denied";
    if (loading) return "loading";
    return secret ? "subscribed" : "unsubscribed";
  }, [permission, loading, secret]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { vapidPublicKey } = await getKey();
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });
      const { secret: newSecret } = await register({ subscription: JSON.stringify(sub) });
      localStorage.setItem(SECRET_KEY, newSecret);
      setSecret(newSecret);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [getKey, register]);

  const unsubscribe = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      await (await reg.pushManager.getSubscription())?.unsubscribe();
      await remove({ secret });
      localStorage.removeItem(SECRET_KEY);
      setSecret(null);
    } finally {
      setLoading(false);
    }
  }, [secret, remove]);

  return { status, subscribe, unsubscribe };
}
