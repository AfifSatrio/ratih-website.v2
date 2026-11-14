import { readFileSync } from "node:fs";
import { join } from "node:path";
import AdvantagesReveal from "./advantages-reveal";

// Inline this trusted project asset so its individual outlines can be drawn.
const mapArtwork = readFileSync(join(process.cwd(), "public/images/ratih/assets/maps.svg"), "utf8");

const cities = [
  { name: "Madiun", x: 114, y: 178 },
  { name: "Surabaya", x: 339, y: 115 },
  { name: "Malang", x: 322, y: 249 },
];

export default function Advantages() {
  return (
    <AdvantagesReveal>
      <div className="advantages-copy">
        <h2 id="advantages-title" tabIndex={-1}>Ide kamu.<br /><span>Karya bersama.</span></h2>
        <p className="advantages-description">
          RATIH hadir sebagai creative partner yang bantu brand ningkatin identitas visualnya lewat karya yang kuat, terkonsep, dan relevan sama kebutuhan zaman.<br />
          Kami fokus di fotografi, videografi, serta branding perusahaan, mulai dari pembuatan logo sampai brand guideline yang rapi dan profesional. RATIH juga bergerak di produksi short movie dengan storytelling yang berkarakter dan kualitas visual yang cinematic.
        </p>
        <dl className="advantages-stats">
          <div><dt>Tahun berjalan</dt><dd aria-label="4 tahun lebih"><span className="stat-value" data-count="years" aria-hidden="true">4</span><span aria-hidden="true">+</span></dd></div>
          <div><dt>Klien puas</dt><dd aria-label="Lebih dari 50 klien"><span className="stat-value" data-count="clients" aria-hidden="true">50</span><span aria-hidden="true">+</span></dd></div>
        </dl>
      </div>
      <figure className="advantages-map">
        <figcaption><h3>Wilayah Kerja</h3></figcaption>
        <svg className="coverage-map" viewBox="-20 -10 760 428" role="img" aria-labelledby="coverage-map-title coverage-map-description">
          <defs>
            <mask id="coverage-routes-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="398">
              <g fill="none" stroke="white" strokeWidth="8" strokeLinecap="round">
                <path className="coverage-route-reveal" d="M114 178 Q205 87 339 115" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
                <path className="coverage-route-reveal" d="M114 178 Q213 218 322 249" pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
              </g>
            </mask>
            <mask id="coverage-pin-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}>
              <image href="/images/ratih/assets/map-pin.svg" width="24" height="24" />
            </mask>
          </defs>
          <g className="coverage-outline" opacity="0.5" dangerouslySetInnerHTML={{ __html: mapArtwork }} />
          <g className="coverage-routes" mask="url(#coverage-routes-mask)" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="7 7" strokeLinecap="round">
            <path d="M114 178 Q205 87 339 115" />
            <path d="M114 178 Q213 218 322 249" />
          </g>
          {cities.map((city) => (
            <g key={city.name}>
              <g className="coverage-pin">
                <circle cx={city.x} cy={city.y} r="10" fill="var(--accent)" opacity="0.14" />
                <circle cx={city.x} cy={city.y} r="3" fill="var(--accent)" />
                <g transform={`translate(${city.x - 16}, ${city.y - 29}) scale(1.3333)`}>
                  <rect width="24" height="24" fill="var(--accent)" mask="url(#coverage-pin-mask)" />
                </g>
              </g>
              <text x={city.x} y={city.y + 28} textAnchor="middle" className="coverage-city-label">{city.name}</text>
            </g>
          ))}
        </svg>
      </figure>
    </AdvantagesReveal>
  );
}
