export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  source?: string;
}

export const DEFAULT_SUGGESTIONS = [
  "Apa itu CationGate?",
  "Siapa pencipta CationGate?",
  "Cara mendaftarkan sekolah SMK?",
  "Metode pembayaran formulir?",
  "Integrasi ekspor ke Dapodik?",
];

export const TOOLTIP_MESSAGES = [
  "Tanya Catpeer aja, miaw!",
  "Butuh bantuan PPDB?",
  "Ada yang bingung?",
  "Catpeer siap bantu!",
];

export const MASCOT_ASSETS = {
  idle: "/assets/catpeer/catpeerStandup.svg",
  thinking: "/assets/catpeer/catpeerTodo.svg",
  writing: "/assets/catpeer/catpeerPegangsurat.svg",
  sleepy: "/assets/catpeer/catpeerBobo.svg",
  icon: "/assets/catpeer/catpeerIcon.svg",
};
