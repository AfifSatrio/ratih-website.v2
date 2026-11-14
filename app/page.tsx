import Hero from "./components/hero";
import SectionJourney from "./components/section-journey";
import Advantages from "./components/advantages";

export default function Home() {
  return (
    <main>
      <SectionJourney advantages={<Advantages />}>
        <Hero />
      </SectionJourney>
    </main>
  );
}
