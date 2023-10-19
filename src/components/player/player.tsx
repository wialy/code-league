import { RENDER_TIME_STEP, RENDER_SCALE } from "~/constants/game";
import { PlayerBody } from "~/types/game";

export const Player = ({ body }: { body: PlayerBody }) => {
  const { position, circleRadius, id, angle } = body;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${position.x * RENDER_SCALE}px, ${
          position.y * RENDER_SCALE
        }px) rotate(${body.angle}deg)`,
        transition: `all ${RENDER_TIME_STEP}ms linear`,
      }}
    >
      <div
        style={{
          borderRadius: "100%",
          backgroundColor: id === 0 ? "white" : id > 0 ? "red" : "blue",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "absolute",
          width: 2 * circleRadius * RENDER_SCALE,
          height: 2 * circleRadius * RENDER_SCALE,
          transform: "translate(-50%, -50%)",
        }}
      >
        {id !== 0 && Math.abs(id).toString(10)}
      </div>
    </div>
  );
};
