import React from "react";
import { Person, ROHIT } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { ToonCover, Verdict } from "../../components/toon";
import { LogoTile } from "./scenes";

export const Case18Cover: React.FC = () => (
  <ToonCover tag="CASE #18" line1="Log logo se nahi," line2="insaan se khareedte" color="#6D4AFD" size1={80} size2={80} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 100, top: 900, transform: "rotate(-3deg)" }}>
      <LogoTile w={320} />
    </div>
    <div style={{ position: "absolute", left: 150, top: 1260 }}>
      <Verdict ok={false} text="LOGO" />
    </div>
    <Place x={560} y={820} s={0.86} z={5}>
      <Person look={ROHIT} seed="r18c" track={[{ at: -100, pose: "wave", mood: "grin" }]} />
    </Place>
    <div style={{ position: "absolute", left: 620, top: 790 }}>
      <Verdict ok text="INSAAN" />
    </div>
  </ToonCover>
);
