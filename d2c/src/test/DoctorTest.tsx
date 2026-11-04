import React from "react";
import { AbsoluteFill } from "remotion";
import { Doctor, Pose } from "../components/Doctor";
import { Bg } from "../components/kit";

const LIST: Pose[] = ["rest", "point", "explain", "stop", "thumbs", "two", "three", "think"];
export const DoctorTest: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    {LIST.map((p, i) => (
      <div key={p} style={{ position: "absolute", left: (i % 4) * 270 - 10, top: Math.floor(i / 4) * 900 + 60, transform: "scale(0.45)", transformOrigin: "0 0" }}>
        <Doctor poses={[{ at: -200, pose: p }]} mouth={() => (i % 2 ? 0.7 : 0)} caseTag="CASE #02" />
        <div style={{ fontSize: 60, fontFamily: "Inter", fontWeight: 800, color: "#12044B", position: "absolute", top: -60, left: 200 }}>{p}</div>
      </div>
    ))}
  </AbsoluteFill>
);
