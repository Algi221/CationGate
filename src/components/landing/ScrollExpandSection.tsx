
import PpdbIconBackground from "./IconBackground";
import ScrollExpandMedia from "../ui/scroll-expansion-hero";

export default function ScrollExpandSection() {
  return (
    <main className="relative overflow-hidden">
      <PpdbIconBackground />

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/assets/landing/office.png"
        title="CationGate"
        date="Mulai Bersama Kami"
        scrollToExpand="Scroll untuk Melanjutkan"
      />
    </main>
  );
}