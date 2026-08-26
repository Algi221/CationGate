import { create } from "zustand";

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (title: string, message: string, type?: string) => void;
  removeToast: (id: string) => void;
}

export function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
    osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.5);
    osc2.stop(audioCtx.currentTime + 0.5);
  } catch (e: unknown) {
    console.log("AudioContext blocked or unsupported:", e instanceof Error ? e.message : String(e));
  }
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  addToast: (title: string, message: string, type = "info") => {
    set((state) => {
      const getStudentKey = (msg: string) => {
        const idMatch = msg.match(/#\d+/);
        if (idMatch) return idMatch[0];
        const nameLabelMatch = msg.match(/Nama:\s*([^·\n]+)/);
        if (nameLabelMatch) return nameLabelMatch[1].trim().toLowerCase();
        const capWordMatch = msg.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/);
        if (capWordMatch) return capWordMatch[0].trim().toLowerCase();
        return null;
      };

      const newKey = getStudentKey(message);
      const filtered = state.toasts.filter((t) => {
        if (t.message === message) return false;
        if (newKey) {
          const oldKey = getStudentKey(t.message);
          if (oldKey && oldKey === newKey) return false;
        }
        return true;
      });

      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setTimeout(() => {
        useToastStore.getState().removeToast(id);
      }, 5000);

      return { toasts: [...filtered, { id, title, message, type }] };
    });

    playNotificationSound();
  },
}));
