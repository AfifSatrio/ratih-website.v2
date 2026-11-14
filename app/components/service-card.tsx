import type { Service } from "../data/services";

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="service-card">
      <div className="service-card-copy">
        <span className="service-icon" aria-hidden="true">
          <span className="service-icon-symbol" style={{
            maskImage: `url(/images/ratih/assets/${service.icon}.svg)`,
            WebkitMaskImage: `url(/images/ratih/assets/${service.icon}.svg)`,
            animationDelay: `${index * 120}ms`,
          }} />
        </span>
        <h3>{service.title}</h3>
        <p className="service-card-description">{service.description}</p>
      </div>
    </article>
  );
}
