import FAQ from "@/components/ui/FAQ";
import ImpactSection from "../../components/Home/ImpactSection";
import ProblemSolution from "../../components/Home/ProblemSolution";
import JoinNow from "@/components/ui/JoinNow";
import BootcampFeatures from "@/components/Ctasection/Ctasection";
import StepSection from "@/components/StepSection/StepSection";
import SuccessSection from "@/components/SuccessSection/SuccessSection";
import LearnSection from "@/components/Home/LearnSection";
import HeroSection from "@/components/Herosection/HeroSection";
import Timeline from "@/components/Timeline/Timeline";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ImpactSection />
      <ProblemSolution />
      <BootcampFeatures />
      <SuccessSection />
      <Timeline/>
      <StepSection />
      <LearnSection />
      <FAQ />
      <JoinNow />
    </div>
  );
}
