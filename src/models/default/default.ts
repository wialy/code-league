import { Vector } from "matter-js";
import { BALL_ID, GOAL_ID } from "~/constants/game";
import { PlayerBody, Snapshot } from "~/types/game";

const model = {
  update: ({ snapshot, id }: { snapshot: Snapshot; id: PlayerBody["id"] }) => {
    const ball = snapshot.find((body) => body.id === BALL_ID);
    const me = snapshot.find((body) => body.id === id);
    const attackGoal = snapshot.find(
      (body) => body.id === (GOAL_ID * id) / Math.abs(id)
    );
    const defenseGoal = snapshot.find(
      (body) => body.id === (GOAL_ID * -id) / Math.abs(id)
    );

    if (!ball || !me || !attackGoal || !defenseGoal) return;

    const directionTowardsBall = Vector.angle(me.position, ball.position);
    const directionTowardsAttackGoal = Vector.angle(
      me.position,
      attackGoal.position
    );
    const directionTowardsDefenseGoal = Vector.angle(me.position, {
      x: defenseGoal.position.x,
      y: ball.position.y,
    });

    const power = 1;

    // am I on the right side of the ball?

    let direction;

    if (
      (me.position.x > ball.position.x &&
        attackGoal.position.x < ball.position.x) ||
      (me.position.x < ball.position.x &&
        attackGoal.position.x > ball.position.x)
    ) {
      direction = directionTowardsBall;
    } else {
      direction = directionTowardsDefenseGoal;
    }

    return {
      direction,
      power,
    };
  },
};

export default model;
