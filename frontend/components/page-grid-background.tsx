import type { CSSProperties } from "react";

const lightGridStyle: CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
  `,
  backgroundSize: "64px 64px",
  WebkitMaskImage:
    "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
  maskImage:
    "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
};

const darkGridStyle: CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, transparent 49%, #27272a 49%, #27272a 51%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, #27272a 49%, #27272a 51%, transparent 51%)
  `,
  backgroundSize: "64px 64px",
  WebkitMaskImage:
    "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
  maskImage:
    "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
};

export function PageGridBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={lightGridStyle}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={darkGridStyle}
      />
    </>
  );
}
