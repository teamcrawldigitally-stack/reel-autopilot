import React from "react";
import { Person, PRIYA } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { Stopwatch, ToonCover } from "../../components/toon";

export const Case25Cover: React.FC = () => (
  <ToonCover tag="CASE #25" line1="Pehle 3 second mein" line2="SKIP!" size1={80} size2={120} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 560, top: 860 }}>
      <Stopwatch p={1} s={400} label="3.0s" />
    </div>
    <Place x={60} y={820} s={0.86} z={5}>
      <Person look={PRIYA} seed="p25c" track={[{ at: -100, pose: "hold", mood: "sad" }]} />
    </Place>
  </ToonCover>
);
