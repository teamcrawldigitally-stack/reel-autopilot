import React from "react";
import { AbsoluteFill } from "remotion";
import { BodyPose, Mood, PRIYA, Person, ROHIT, Jar, Note, Coin, Parcel, Piggy, Truck } from "../components/Cartoon";
import { Bg } from "../components/kit";

const L: [BodyPose, Mood][] = [["idle", "neutral"], ["megaphone", "shout"], ["cheer", "grin"], ["shrug", "shock"], ["hold", "happy"], ["sad", "sad"]];
export const CastTest: React.FC = () => (
  <AbsoluteFill>
    <Bg />
    {L.map(([p, m], i) => (
      <div key={p} style={{ position: "absolute", left: (i % 3) * 360 - 10, top: Math.floor(i / 3) * 560 + 40, transform: "scale(0.6)", transformOrigin: "0 0" }}>
        <Person look={i === 4 ? PRIYA : ROHIT} track={[{ at: -100, pose: p, mood: m }]} seed={p} />
      </div>
    ))}
    <div style={{ position: "absolute", left: 20, top: 1200, display: "flex", gap: 20, alignItems: "flex-end" }}>
      <Jar level={0.5} color="#9C93B8" label="Product + Shipping" amount="₹300" w={200} />
      <Jar level={0.3} color="#6D4AFD" label="Ads" amount="₹250" w={200} />
      <Jar level={0.1} color="#16A34A" label="Profit" amount="₹50" w={200} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Note /><Coin /><Parcel w={160} tag="₹600" ribbon /><Piggy w={200} /><Truck w={180} />
      </div>
    </div>
  </AbsoluteFill>
);
