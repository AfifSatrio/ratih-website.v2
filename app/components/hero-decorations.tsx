import Image from "next/image";

export default function HeroDecorations() {
  return (
    <div className="hero-decorations" aria-hidden="true">
      {(["left", "right"] as const).map((side) => (
        <div className={`hero-side hero-side-${side}`} key={side}>
          <div className={`hero-drift hero-drift-${side}`}>
            {[0, 1].map((copy) => (
              <div className="hero-decoration-group" key={copy}>
                {Array.from({ length: 4 }, (_, index) => {
                  const yellow = (index + (side === "left" ? 0 : 1)) % 2 === 1;
                  return (
                    <Image
                      key={index}
                      className="hero-decoration"
                      src={`/images/ratih/assets/element-${yellow ? 1 : 2}.svg`}
                      alt=""
                      width={951}
                      height={552}
                      draggable={false}
                      loading="eager"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
