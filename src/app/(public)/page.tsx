import FAQ from "@/components/ui/FAQ";
import HeroSection from "../../components/Home/HeroSection";
import ImpactSection from "../../components/Home/ImpactSection";
import ProblemSolution from "../../components/Home/ProblemSolution";
import JoinNow from "@/components/ui/JoinNow";
import BootcampFeatures from "@/components/Ctasection/Ctasection";
import StepSection from "@/components/StepSection/StepSection";
import SuccessSection from "@/components/SuccessSection/SuccessSection";
import LearnSection from "@/components/Home/LearnSection";
import HeroSections from "@/components/mainhome/HeroSections";
import HeroSectionNew from "@/components/Herosection/HeroSection";
import Timeline from "@/components/Timeline/Timeline";

<<<<<<< HEAD
export default function Home() {
  return (
    <div>
=======



export default function Home() {
  return (
    <div >
      
>>>>>>> 5903b4acab9c5598cbcf04e0d08ba85c131f506f
      <HeroSectionNew />
      <HeroSections /> 
      <HeroSection />
      <div className="container mx-auto px-6 py-10">
        <ImpactSection />
        <ProblemSolution />
        <BootcampFeatures />
        <SuccessSection />
        <Timeline />
        <StepSection />
        <LearnSection />
        <FAQ />
        <JoinNow />
      </div>
    </div>
  );
}
