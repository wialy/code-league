import { Bodies, Body, Composite, Engine, Events, Vector } from "matter-js";
import { Renderer } from "~/components/renderer";
import {
  BALL_CONFIG,
  BALL_ID,
  BALL_RADIUS,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  GOAL_ID,
  MAX_FORCE,
  PHYSICS_ITERATIONS,
  PHYSICS_TIME_STEP,
  PLAYER_CONFIG,
  PLAYER_RADIUS,
  WALL_CONFIG,
  WALL_WIDTH,
} from "~/constants/game";
import {
  AbstractBody,
  PlayerBody,
  Snapshot,
  WallBody,
  isPlayerBody,
} from "~/types/game";

import DefaultModel from "~/models/default";

export const Game = () => {
  const engine = Engine.create({
    gravity: {
      x: 0,
      y: 0,
    },
  });

  const goals = [
    Bodies.rectangle(-FIELD_WIDTH / 2, 0, WALL_WIDTH, FIELD_HEIGHT, {
      ...WALL_CONFIG,
      id: GOAL_ID,
      isSensor: true,
    }),
    Bodies.rectangle(FIELD_WIDTH / 2, 0, WALL_WIDTH, FIELD_HEIGHT, {
      ...WALL_CONFIG,
      id: -GOAL_ID,
      isSensor: true,
    }),
  ];

  const ball = Bodies.circle(0, 0, BALL_RADIUS, BALL_CONFIG);

  Composite.add(engine.world, goals);
  Composite.add(engine.world, ball);

  const TEAM_SIZE = 3;

  for (let i = 0; i < TEAM_SIZE; i++) {
    Composite.add(engine.world, [
      Bodies.circle(
        -FIELD_WIDTH / 3,
        FIELD_HEIGHT * (1 / TEAM_SIZE) * (i - (TEAM_SIZE - 1) / 2),
        PLAYER_RADIUS,
        {
          ...PLAYER_CONFIG,
          id: -(i + 1),
        }
      ),
      Bodies.circle(
        FIELD_WIDTH / 3,
        FIELD_HEIGHT * (1 / TEAM_SIZE) * (i - (TEAM_SIZE - 1) / 2),
        PLAYER_RADIUS,
        {
          ...PLAYER_CONFIG,
          id: i + 1,
        }
      ),
    ]);
  }

  Composite.add(engine.world, [
    Bodies.rectangle(
      0,
      -WALL_WIDTH / 2 - FIELD_HEIGHT / 2,
      FIELD_WIDTH + WALL_WIDTH,
      WALL_WIDTH,
      {
        ...WALL_CONFIG,
        id: 2000,
      }
    ),
    Bodies.rectangle(
      0,
      WALL_WIDTH / 2 + FIELD_HEIGHT / 2,
      FIELD_WIDTH + WALL_WIDTH,
      WALL_WIDTH,
      {
        ...WALL_CONFIG,
        id: 2001,
      }
    ),
    Bodies.rectangle(
      -WALL_WIDTH - FIELD_WIDTH / 2,
      0,
      WALL_WIDTH,
      FIELD_HEIGHT + WALL_WIDTH * 2,
      {
        ...WALL_CONFIG,
        id: 2002,
      }
    ),
    Bodies.rectangle(
      WALL_WIDTH + FIELD_WIDTH / 2,
      0,
      WALL_WIDTH,
      FIELD_HEIGHT + WALL_WIDTH * 2,
      {
        ...WALL_CONFIG,
        id: 2003,
      }
    ),
  ]);

  const snapshots: Snapshot[] = [];

  Events.on(engine, "collisionStart", ({ pairs }) => {
    pairs.forEach(({ bodyA, bodyB }) => {
      if (
        (bodyA.id === BALL_ID && bodyB.id === goals[0].id) ||
        (bodyB.id === BALL_ID && bodyA.id === goals[0].id) ||
        (bodyA.id === BALL_ID && bodyB.id === goals[1].id) ||
        (bodyB.id === BALL_ID && bodyA.id === goals[1].id)
      ) {
        Body.setPosition(ball, { x: 0, y: 0 });
        Body.setVelocity(ball, { x: 0, y: 0 });
        Body.setAngularVelocity(ball, 0);
        Body.setAngle(ball, 0);
        Body.setAngularSpeed(ball, 0);
        Body.setSpeed(ball, 0);
      }
    });
  });

  for (let i = 0; i < PHYSICS_ITERATIONS; i++) {
    const snapshot: Snapshot = [];
    engine.world.bodies.forEach((body) => {
      const abstractBody: AbstractBody = {
        position: { ...body.position },
        angle: body.angle,
        id: body.id,
        isStatic: body.isStatic,
        velocity: { ...body.velocity },
        angularVelocity: body.angularVelocity,
      };
      if (body.isStatic) {
        const wallBody: WallBody = {
          ...abstractBody,
          bounds: body.bounds,
        };
        snapshot.push(wallBody);
      } else {
        const playerBody: PlayerBody = {
          ...abstractBody,
          circleRadius: body.circleRadius ?? 0,
        };
        snapshot.push(playerBody);
      }
    });

    engine.world.bodies.forEach((body) => {
      if (body.id === 0 || body.isStatic) {
        return;
      }

      if (isPlayerBody(body)) {
        const action = DefaultModel.update({ snapshot, id: body.id });

        if (action) {
          const { direction, power } = action;
          const force: Vector = {
            x:
              Math.cos(direction) * Math.max(0, Math.min(1, power)) * MAX_FORCE,
            y:
              Math.sin(direction) * Math.max(0, Math.min(1, power)) * MAX_FORCE,
          };

          Body.applyForce(body, body.position, force);
        }
      }
    });

    snapshots.push(snapshot);

    Engine.update(engine, PHYSICS_TIME_STEP);
  }

  return <Renderer snapshots={snapshots} />;
};
