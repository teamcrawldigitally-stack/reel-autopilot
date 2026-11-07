import React from "react";
import { Person, ROHIT } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { Gauge, Panel, ToonCover } from "../../components/toon";

export const Case15Cover: React.FC = () => (
  <ToonCover tag="CASE #15" line1="ROAS 3 hai," line2="phir bhi loss?" set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 440, top: 860 }}>
      <Panel style={{ padding: "60px 24px 6px" }}>
        <Gauge value={3} line={3.3} w={520} lineLabel="3.3" />
      </Panel>
    </div>
    <Place x={40} y={820} s={0.86} z={5}>
      <Person look={ROHIT} seed="r15c" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </Place>
  </ToonCover>
);
