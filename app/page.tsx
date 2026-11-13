import Hero from "./components/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <section id="layanan" className="services" aria-labelledby="services-title">
        <p className="section-label">Eksplorasi kreativitas</p>
        <h2 id="services-title">Yang kami kerjakan.</h2>
        <ul>
          {["Fotografi", "Videografi", "Desain Grafis"].map((service, index) => (
            <li key={service}><span>0{index + 1}</span>{service}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
