import { PanelGrid, Button, GlitchLink, GlitchText } from "@/src/react";
import type { PanelData } from "@/src/core/types";
import "@/src/core/theme.css";
import "@/src/core/components.css";
import "@/src/react/glitch/glitch.css";

const PANELS: PanelData[] = [
  {
    id: "task-tank",
    title: "Task Tank",
    description: "A gamified task tracking and pomodoro timer application",
    thumbnail: "full-tank-scene.png",
    tags: ["Java", "JavaFX", "SQLite"],
  },
  {
    id: "dead-bread",
    title: "Dead Bread",
    description: "A VR resupply run in a store while fighting off zombies",
    thumbnail: "start_screen.png",
    tags: ["Unity", "C#", "VR"],
  },
  {
    id: "boids",
    title: "Boids",
    description: "Finite state machines and other enemy functionality",
    thumbnail: "Idle Drones.png",
    tags: ["Unity", "C#"],
  },
];
export default function Home() {
  return (
    <main
      style={{
        maxWidth: "64rem",
        margin: "0 auto",
        padding: "4rem 1.5rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        lotus-library
      </h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
        Reusable Panel, Button and Glitch components for reproducible custom
        websites.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "3rem",
        }}
      >
        <Button text="View Projects" arrow="right" href="/projects" />
        <Button text="Read Blog" arrow="right" href="/blog" />
        <Button text="Disabled" disabled />
      </div>

      <p style={{ marginBottom: "3rem", fontSize: "1.1rem" }}>
        Built for my{" "}
        <GlitchLink href="https://sausytime.com">Design Portfolio</GlitchLink>{" "}
        and{" "}
        <GlitchLink href="https://jdlanyon.dev">developer portfolio</GlitchLink>
        .{" "}
        <GlitchText
          names={["Python", "C#", "React", "TypeScript", "Vue"]}
          delay={2500}
          intensity={1.5}
        />
      </p>

      <PanelGrid
        heading="Projects"
        thumbnailPath="/programming/uni"
        basePath="/programming/uni"
        panels={PANELS}
      />
    </main>
  );
}

