import HeroSection from "@/Components/HeroSection";
import StatsSection from "@/Components/StatsSection";
import Plans from "@/Components/Plans";
import Features from "@/Components/Features";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <StatsSection />
      <Features/>
      <Plans/>
    </div>
  );
}