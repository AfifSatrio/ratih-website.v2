import Hero from "./components/hero";
import SectionJourney from "./components/section-journey";

export default function Home() {
  return (
    <main>
      <SectionJourney>
        <Hero />
      </SectionJourney>
    </main>
  );
}
