import React from "react";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE, Place } from "../../components/format";
import { PhotoCard } from "../../components/hisaabArt";
import { MoneyRoom } from "../../components/sets";
import { ToonCover, Verdict } from "../../components/toon";

export const Case17Cover: React.FC = () => (
  <ToonCover tag="CASE #17" line1="Photo mein product hai," line2="fayda kahan?" size1={72} set={<MoneyRoom />}>
    <div style={{ position: "absolute", left: 520, top: 840, border: `6px solid ${LINE}`, borderRadius: 30, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden", transform: "rotate(3deg)" }}>
      <PhotoCard kind="plain" w={400} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 1370 }}>
      <Verdict ok={false} text="FAYDA" />
    </div>
    <Place x={60} y={800} s={0.86} z={5}>
      <Person look={PRIYA} seed="p17c" track={[{ at: -100, pose: "shrug", mood: "sad" }]} />
    </Place>
  </ToonCover>
);
