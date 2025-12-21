import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { EffectsLayerProps } from "../../types";

export default function EffectsLayer({ effect }: EffectsLayerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!effect) return null;
  if (!ready) return null;

  switch (effect) {
    case "snow":
      return <Snowfall color="#82C3D9" snowflakeCount={120} />;

    case "confetti":
      return <Confetti numberOfPieces={100} recycle />;

    case "stars":
      return (
        <Particles
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 30 },
              shape: { type: "star" },
              color: { value: "#fff475" },
              size: { value: 5 },
              move: { enable: true, speed: 2 },
            },
          }}
        />
      );

    case "hearts":
      return (
        <Particles
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 30 },
              shape: { type: "polygon" },
              color: { value: "#ff6fae" },
              size: { value: 6 },
              move: { enable: true, speed: 1 },
            },
          }}
        />
      );

    case "rain":
      return (
        <Particles
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 120 },
              shape: { type: "circle" },
              color: { value: "#9ecbff" },
              size: { value: 2 },
              move: {
                enable: true,
                speed: 5,
                direction: "bottom",
              },
            },
          }}
        />
      );

    default:
      return null;
  }
}
