import React from "react";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE, Place } from "../../components/format";
import { Bottle } from "../../components/props";
import { MoneyRoom } from "../../components/sets";
import { ToonCover, big } from "../../components/toon";
import { C } from "../../theme";
import { Sachet } from "./scenes";

const Tag: React.FC<{ t: string; c: string }> = ({ t, c }) => <div style={{ ...big(60, C.white), background: c, border: `5px solid ${LINE}`, borderRadius: 16, padding: "8px 20px 0", boxShadow: `5px 5px 0 ${LINE}` }}>{t}</div>;

export const Case22Cover: React.FC = () => (
  <ToonCover tag="CASE #22" line1="₹5 ka sample," line2="₹500 ka agla order" color="#16A34A" size1={90} size2={84} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 380, top: 900, display: "flex", alignItems: "flex-end", gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Sachet w={170} />
        <Tag t="₹5" c={C.violet} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Bottle level={0.85} w={170} label="SERUM" />
        <Tag t="₹500" c={C.green} />
      </div>
    </div>
    <Place x={20} y={820} s={0.86} z={5}>
      <Person look={PRIYA} seed="p22c" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
    </Place>
  </ToonCover>
);
