export default function SectionNavigation() {
  return (
    <nav className="section-nav" aria-label="Navigasi section" aria-hidden="true" inert>
      <button type="button" data-scene="hero" aria-label="Ke Beranda" aria-controls="beranda" aria-current="location">
        <span className="section-nav-label" aria-hidden="true">Beranda</span>
        <span className="section-nav-line" aria-hidden="true" />
      </button>
      <button type="button" data-scene="services" aria-label="Ke Layanan" aria-controls="layanan">
        <span className="section-nav-label" aria-hidden="true">Layanan</span>
        <span className="section-nav-line" aria-hidden="true" />
      </button>
      <button type="button" data-scene="advantages" aria-label="Ke Keunggulan" aria-controls="keunggulan">
        <span className="section-nav-label" aria-hidden="true">Keunggulan</span>
        <span className="section-nav-line" aria-hidden="true" />
      </button>
    </nav>
  );
}
