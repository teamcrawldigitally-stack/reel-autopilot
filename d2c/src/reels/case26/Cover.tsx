import React from "react";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE, Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { ToonCover, ToonPhone, ToonSpinner, big } from "../../components/toon";
import { C } from "../../theme";

export const Case26Cover: React.FC = () => (
  <ToonCover tag="CASE #26" line1="Website 3 sec late?" line2="aadhe log gaye!" size1={84} size2={100} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 560, top: 840 }}>
      <ToonPhone w={380} h={620}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <ToonSpinner s={150} color={C.red} />
          <div style={big(110, C.red)}>3.0s</div>
        </div>
      </ToonPhone>
    </div>
    <Place x={60} y={820} s={0.86} z={5}>
      <Person look={PRIYA} seed="p26c" track={[{ at: -100, pose: "shrug", mood: "shout" }]} />
    </Place>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: LINE }} />
  </ToonCover>
);
