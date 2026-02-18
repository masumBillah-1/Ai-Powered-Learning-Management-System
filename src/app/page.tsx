
import HeroSection from "../components/Home/HeroSection"
import ImpactSection from "../components/Home/ImpactSection"
import ProblemSolution from "../components/Home/ProblemSolution"

export default function Home() {
  return (
    
      <div className="container mx-auto px-6 py-10">
         <HeroSection/>
         <ImpactSection/>
         <ProblemSolution/>
      <FAQ />
    <JoinNow />
      </div>
  

  );
}