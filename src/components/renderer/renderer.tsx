"use client";

import { useEffect, useState } from "react";
import { Snapshot, isPlayerBody, isWallBody } from "~/types/game";
import { Player } from "../player";
import { GOAL_ID, RENDER_TIME_STEP, RENDER_SCALE } from "~/constants/game";

export const Renderer = ({ snapshots }: { snapshots: Snapshot[] }) => {
  const [bodies, setBodies] = useState<Snapshot>([]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= snapshots.length - 1) {
        clearInterval(interval);
        return;
      }

      setBodies(snapshots[index + 1]);

      index++;
    }, RENDER_TIME_STEP);

    return () => clearInterval(interval);
  }, [snapshots]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
      }}
    >
      {bodies.map((body) => {
        if (isPlayerBody(body)) {
          return <Player key={`body-${body.id}`} body={body} />;
        } else if (isWallBody(body)) {
          return (
            <div
              key={`body-${body.id}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translate(${body.position.x * RENDER_SCALE}px, ${
                  body.position.y * RENDER_SCALE
                }px) rotate(${body.angle}deg)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translate(-50%, -50%)`,
                  width:
                    Math.abs(body.bounds.max.x - body.bounds.min.x) *
                    RENDER_SCALE,
                  height:
                    Math.abs(body.bounds.max.y - body.bounds.min.y) *
                    RENDER_SCALE,
                  backgroundColor:
                    body.id === GOAL_ID
                      ? "rgba(0,0,255,0.5)"
                      : body.id === -GOAL_ID
                      ? "rgba(255,0,0,0.5)"
                      : "rgba(255,255,255,0.1)",
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
