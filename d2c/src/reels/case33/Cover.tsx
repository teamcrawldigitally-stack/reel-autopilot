import React from "react";
import { Person, ROHIT } from "../../components/Cartoon";
import { Place } from "../../components/format";
import { MoneyRoom } from "../../components/sets";
import { ToonCover } from "../../components/toon";
import { Channel } from "./scenes";

export const Case33Cover: React.FC = () => (
  <ToonCover tag="CASE #33" line1="₹10,000: Meta ya Google?" line2="galat jagah = aadha bekaar" size1={72} size2={68} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 70, top: 880, transform: "rotate(-4deg)" }}>
      <Channel name="Meta" color="#1877F2" w={280} />
    </div>
    <div style={{ position: "absolute", left: 730, top: 880, transform: "rotate(4deg)" }}>
      <Channel name="Google" color="#16A34A" w={280} />
    </div>
    <Place x={330} y={840} s={0.82} z={5}>
      <Person look={ROHIT} seed="r33c" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </Place>
  </ToonCover>
);
