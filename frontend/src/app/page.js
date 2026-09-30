import HeroSection from "@/Components/HeroSection";
import StatsSection from "@/Components/StatsSection";
import Plans from "@/Components/Plans";
import Features from "@/Components/Features";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black transition-colors duration-300 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <HeroSection />
      <StatsSection />
      <Features />
      <Plans />
    </div>
  );
}