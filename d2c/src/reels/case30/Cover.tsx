import React from "react";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { ToonCover } from "../../components/toon";
import { Say } from "./scenes";

export const Case30Cover: React.FC = () => (
  <ToonCover tag="CASE #30" line1="Aap vs customer ke shabd," line2="kaun bechega?" color="#6D4AFD" size1={64} size2={100} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 60, top: 820 }}>
      <Say w={400}>"Premium quality"</Say>
    </div>
    <div style={{ position: "absolute", left: 560, top: 820 }}>
      <Say w={440} tail="right" bg="#E3F6EA">
        "Baal girna band hua!"
      </Say>
    </div>
    <Place x={60} y={1010} s={0.62} z={5}>
      <Person look={ROHIT} seed="r30c" track={[{ at: -100, pose: "megaphone", mood: "happy" }]} />
    </Place>
    <Place x={680} y={1010} s={0.62} z={5}>
      <Person look={PRIYA} seed="p30c" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
    </Place>
  </ToonCover>
);
