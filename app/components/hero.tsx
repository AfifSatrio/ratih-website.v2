import { readFileSync } from "node:fs";
import { join } from "node:path";
import HeroReveal from "./hero-reveal";

// Trusted, project-owned SVG; kept inline in the DOM so anime.js can draw its paths.
const artwork = readFileSync(
  join(process.cwd(), "public/images/ratih/ratih-creative.svg"),
  "utf8",
);

export default function Hero() {
  return (
    <HeroReveal>
      <div className="hero-stage" dangerouslySetInnerHTML={{ __html: artwork }} />
    </HeroReveal>
  );
}
