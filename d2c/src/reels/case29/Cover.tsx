import React from "react";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE, Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { Panel, ToonCover, big } from "../../components/toon";
import { C } from "../../theme";
import { StudioCam } from "./scenes";

export const Case29Cover: React.FC = () => (
  <ToonCover tag="CASE #29" line1="₹50,000 ka shoot haara," line2="₹0 ke phone video se?" size1={74} size2={78} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 80, top: 880, filter: "grayscale(0.7)" }}>
      <Panel style={{ padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <StudioCam w={200} />
        <div style={{ ...big(48, C.white), background: C.violet, border: `5px solid ${LINE}`, borderRadius: 16, padding: "8px 18px 0" }}>₹50,000</div>
      </Panel>
    </div>
    <Place x={560} y={820} s={0.86} z={5}>
      <Person look={PRIYA} seed="p29c" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
    </Place>
    <div style={{ position: "absolute", left: 620, top: 790, ...big(50, C.white), background: C.green, border: `5px solid ${LINE}`, borderRadius: 16, padding: "8px 18px 0", boxShadow: `5px 5px 0 ${LINE}` }}>₹0 PHONE</div>
  </ToonCover>
);
