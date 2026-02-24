import FAQ from "@/components/ui/FAQ";
import HeroSection from "../components/Home/HeroSection";
import ImpactSection from "../components/Home/ImpactSection";
import ProblemSolution from "../components/Home/ProblemSolution";
import JoinNow from "@/components/ui/JoinNow";
import BootcampFeatures from "@/components/Ctasection/Ctasection";
import StepSection from "@/components/StepSection/StepSection";
import SuccessSection from "@/components/SuccessSection/SuccessSection";
import LearnSection from "@/components/Home/LearnSection";
import ReleaseNotesPage from "@/components/ReleaseNotesPage/ReleaseNotesPage";
import FeatureBoard from "@/components/FeatureBoard/FeatureBoard";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-10">
      <HeroSection />
      <ImpactSection />
      <ProblemSolution />
      <BootcampFeatures />
      <SuccessSection />
      <StepSection />
      <LearnSection />
      <FAQ />
      <JoinNow />
      <ReleaseNotesPage></ReleaseNotesPage>
      <FeatureBoard></FeatureBoard>
    </div>
  );
}
