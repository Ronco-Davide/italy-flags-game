import FlagGame from "@/components/FlagGame"; // o il percorso corretto dove si trova il tuo componente

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#F7F5EE]">
      <FlagGame />
    </main>
  );
}