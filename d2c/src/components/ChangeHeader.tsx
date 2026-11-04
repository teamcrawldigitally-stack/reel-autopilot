import React from "react";
import { interpolate } from "remotion";
import { C, theme } from "../theme";
import { Chip, Enter, Headline, useSpring } from "./kit";

/** "BADLAAV n/3" chip with progress dots + headline. */
export const ChangeHeader: React.FC<{ n: number; title: string; hl?: string[]; delay?: number; size?: number; icon?: React.ReactNode }> = ({
  n,
  title,
  hl = [],
  delay = 0,
  size = 112,
  icon,
}) => {
  const fill = useSpring(delay + 6, "bouncy");
  return (
    <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <Enter delay={delay} cfg="snappy">
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Chip size={32}>BADLAAV {n}/3</Chip>
          <div style={{ display: "flex", gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: `4px solid ${C.violet}`,
                  background: i < n ? C.violet : i === n ? `rgba(109,74,253,${fill})` : "transparent",
                  transform: i === n ? `scale(${interpolate(fill, [0, 1], [0.6, 1])})` : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </Enter>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {icon && <Enter delay={delay + 8} cfg="bouncy" from="none" scaleFrom={0.3}>{icon}</Enter>}
        <Headline text={title} delay={delay + 4} size={size} hl={hl} />
      </div>
    </div>
  );
};
