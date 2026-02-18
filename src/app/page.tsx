
import FAQ from "@/components/ui/FAQ";
import HeroSection from "../components/Home/HeroSection"
import ImpactSection from "../components/Home/ImpactSection"
import ProblemSolution from "../components/Home/ProblemSolution"
import JoinNow from "@/components/ui/JoinNow";
import LearnSection from "@/components/Home/LearnSection";

export default function Home() {
  return (

    <div className="container mx-auto px-6 py-10">
      <HeroSection />
      <ImpactSection />
      <ProblemSolution />
      <LearnSection/>
      <FAQ />
      <JoinNow />
    </div>


  );
}