import React from "react";
import { Person, ROHIT } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { Panel, ToonCover, big, body } from "../../components/toon";
import { C } from "../../theme";

export const Case21Cover: React.FC = () => (
  <ToonCover tag="CASE #21" line1="₹5,000 har mahine" line2="bina khule apps pe?" size1={84} size2={82} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 470, top: 880, transform: "rotate(3deg)" }}>
      <Panel style={{ padding: "22px 30px", width: 500 }} bg="#FFF1F1">
        <div style={body(30, C.muted)}>SAAL KA</div>
        <div style={big(100, C.red)}>₹58,800</div>
        <div style={body(30)}>7 apps × ₹700</div>
      </Panel>
    </div>
    <Place x={40} y={820} s={0.86} z={5}>
      <Person look={ROHIT} seed="r21c" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </Place>
  </ToonCover>
);
